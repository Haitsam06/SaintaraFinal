<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\Token;
use App\Models\Pembayaran;
use App\Models\Paket;

// Pastikan Anda sudah menginstal SDK Midtrans: composer require midtrans/midtrans-php
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class TransaksiPersonalController extends Controller
{
    /**
     * Menampilkan halaman transaksi, saldo token, dan daftar paket.
     */
    public function index()
    {
        $user = Auth::guard('customer')->user(); 

        if (!$user) {
            return redirect()->route('login');
        }

        // 1. Ambil Rincian Token per Paket
        $rincianToken = Token::where('customer_id', $user->id_customer)
                            ->where('status', 'belum digunakan')
                            ->join('pakets', 'tokens.paket_id', '=', 'pakets.id_paket')
                            ->select('pakets.nama_paket', 'pakets.id_paket', DB::raw('count(*) as total'))
                            ->groupBy('pakets.id_paket', 'pakets.nama_paket')
                            ->get();

        // Hitung total semua token
        $totalToken = $rincianToken->sum('total');

        // 2. Ambil Riwayat Pembayaran
        $riwayat = Pembayaran::where('customer_id', $user->id_customer)
                        ->with('paket')
                        ->latest()
                        ->get()
                        ->map(function($p) {
                            return [
                                'id' => $p->id_transaksi,
                                'nama_paket' => $p->paket->nama_paket ?? 'Paket Tidak Dikenal',
                                'tanggal' => $p->created_at->translatedFormat('d M Y'),
                                'jumlah_bayar' => (int) $p->jumlah_bayar,
                                'status' => $p->status_pembayaran, // 'menunggu', 'berhasil', 'gagal'
                            ];
                        });

        // 3. Ambil Daftar Paket
        $daftarPaket = Paket::all();

        return Inertia::render('Personal/transaksi-token', [
            'saldo_token' => $totalToken,
            'rincian_token' => $rincianToken,
            'riwayat' => $riwayat,
            'daftar_paket' => $daftarPaket
        ]);
    }

    /**
     * Memproses checkout: Simpan 'Pending' ke DB & Minta Snap Token ke Midtrans
     */
    public function checkout(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'paket_id' => 'required|exists:pakets,id_paket',
            'quantity' => 'required|integer|min:1',
            // 'total_harga' dihapus dari validasi karena dihitung di server
        ]);

        // 2. Setup Konfigurasi Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
        
        return DB::transaction(function () use ($request) {
            $user = Auth::guard('customer')->user();
            $paket = Paket::findOrFail($request->paket_id);
            
            // Hitung total harga yang sebenarnya dari server (PENTING untuk keamanan)
            $totalHarga = $paket->harga * $request->quantity;
            
            // 3. Buat ID Order Unik
            do {
                $orderId = 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));
            } while (Pembayaran::where('id_transaksi', $orderId)->exists());

            // 4. Siapkan Parameter Request Midtrans
            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => (int) $totalHarga, // Pastikan integer
                ],
                'customer_details' => [
                    'first_name' => $user->nama_lengkap ?? $user->name, // Gunakan nama yang tersedia
                    'email' => $user->email,
                    'phone' => $user->no_telp,
                ],
                'item_details' => [
                    [
                        'id' => $paket->id_paket,
                        'price' => (int) $paket->harga,
                        'quantity' => (int) $request->quantity,
                        'name' => $paket->nama_paket,
                    ]
                ],
                // URL untuk dikembalikan ke aplikasi setelah pembayaran
                'callbacks' => [
                    'finish' => url('/personal/transaksiTokenPersonal?status=finish&order_id=' . $orderId),
                    'unfinish' => url('/personal/transaksiTokenPersonal?status=unfinish&order_id=' . $orderId),
                    'error' => url('/personal/transaksiTokenPersonal?status=error&order_id=' . $orderId),
                ]
            ];

            try {
                // 5. Minta Snap Token dari Midtrans
                $snapToken = Snap::getSnapToken($params);

                // 6. Simpan Transaksi ke Database (Status: MENUNGGU)
                Pembayaran::create([
                    'id_transaksi'      => $orderId,
                    'customer_id'       => $user->id_customer,
                    'paket_id'          => $paket->id_paket,
                    'jumlah_token'      => $request->quantity, // Pastikan kolom ini ada
                    'jumlah_bayar'      => $totalHarga,
                    'status_pembayaran' => 'menunggu',
                    'metode_pembayaran' => 'midtrans',
                    'url_pembayaran'    => $snapToken, // Simpan snap token di sini (opsional)
                ]);

                // 7. Return Token ke Frontend (JSON) agar bisa dipakai window.snap.pay
                return response()->json(['snap_token' => $snapToken]);

            } catch (\Exception $e) {
                // Catat error Midtrans
                \Log::error('Midtrans Snap Error: ' . $e->getMessage());
                return response()->json(['error' => 'Gagal memproses pembayaran: ' . $e->getMessage()], 500);
            }
        });
    }

    /**
     * Dipanggil oleh Midtrans (Webhook) saat transaksi berubah status.
     * Logika Generate Token ada di sini.
     */
    public function callback(Request $request)
    {
        // 1. Set Konfigurasi Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;

        try {
            // 2. Tangkap Notifikasi dari Midtrans
            $notif = new Notification();

            $transactionStatus = $notif->transaction_status;
            $orderId = $notif->order_id;
            $statusCode = $notif->status_code;

            // 3. Cari data transaksi berdasarkan ID
            $pembayaran = Pembayaran::where('id_transaksi', $orderId)->first();

            if (!$pembayaran) {
                return response()->json(['message' => 'Transaction not found'], 404);
            }

            // Cek apakah status sudah berhasil sebelumnya (mencegah duplikasi token)
            if ($pembayaran->status_pembayaran == 'berhasil') {
                return response()->json(['message' => 'Already processed'], 200);
            }

            // Tentukan status yang akan disimpan ke database
            $statusToSave = 'menunggu';
            if ($transactionStatus == 'settlement' || ($transactionStatus == 'capture' && $statusCode == '200')) {
                $statusToSave = 'berhasil';
            } else if ($transactionStatus == 'pending') {
                $statusToSave = 'menunggu';
            } else if (in_array($transactionStatus, ['deny', 'expire', 'cancel', 'failure'])) {
                $statusToSave = 'gagal';
            }

            // 4. Proses Update Status dan Generate Token
            if ($statusToSave == 'berhasil') {
                // Hanya proses di dalam transaction jika statusnya berhasil
                DB::transaction(function () use ($pembayaran, $statusToSave) {
                    
                    // a. Update status pembayaran
                    $pembayaran->update([
                        'status_pembayaran' => $statusToSave,
                        'waktu_dibayar' => now(),
                        // Simpan detail Midtrans lainnya di sini jika perlu
                    ]);

                    // b. === LOGIKA GENERATE TOKEN DI SINI (KUNCI UTAMA) ===
                    $paket = Paket::findOrFail($pembayaran->paket_id);

                    // Loop sebanyak jumlah quantity yang dibeli
                    for ($i = 0; $i < $pembayaran->jumlah_token; $i++) {
                        
                        // Generate kode token unik (Sesuai format: PRM-20251123-X7K9)
                        $prefix = $pembayaran->paket_id;
                        $tanggal = now()->format('Ymd');
                        $acak = strtoupper(Str::random(5));
                        $kodeToken = $prefix . '-' . $tanggal . '-' . $acak;

                        // Pastikan Token Unik (PENTING)
                        while(Token::where('id_token', $kodeToken)->exists()){
                            $acak = strtoupper(Str::random(5));
                            $kodeToken = $prefix . '-' . $tanggal . '-' . $acak;
                        }

                        // Simpan Token ke Database
                        Token::create([
                            'id_token'      => $kodeToken, // Simpan kode unik
                            'pembayaran_id' => $pembayaran->id_transaksi,
                            'customer_id'   => $pembayaran->customer_id,
                            'paket_id'      => $pembayaran->paket_id, 
                            'status'        => 'belum digunakan',
                        ]);
                    }
                });
            } else if ($statusToSave) {
                // Jika statusnya GAGAL atau KADALUARSA, update status saja tanpa generate token
                 $pembayaran->update(['status_pembayaran' => $statusToSave]);
            }

            // 5. Kembalikan respons 200 OK ke Midtrans
            return response()->json(['message' => 'Callback received successfully and processed'], 200);

        } catch (\Exception $e) {
            \Log::error('Midtrans Callback Error: ' . $e->getMessage());
            // Kembalikan error 500 jika ada masalah, agar Midtrans mencoba ulang
            return response()->json(['message' => 'Error processing callback', 'error' => $e->getMessage()], 500);
        }
    }
}