<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Token;
use App\Models\Pembayaran;
use App\Models\Paket;
use Midtrans\Config;
use Midtrans\Snap;

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

        // --- PERBAIKAN LOGIC: HITUNG TOKEN ---

        // 1. Ambil semua token 'belum digunakan' milik user
        $allTokens = Token::where('customer_id', $user->id_customer)
            ->where('status', 'belum digunakan')
            ->get();

        // 2. Kelompokkan Token berdasarkan Kode Paket (Prefix ID)
        $groupedTokens = $allTokens->groupBy(function ($token) {
            $parts = explode('-', $token->id_token);
            return $parts[0]; // Mengambil bagian pertama (ID Paket)
        });

        // 3. Ambil Info Paket dari Database berdasarkan ID yang ditemukan
        $paketIds = $groupedTokens->keys();
        $infoPaket = Paket::whereIn('id_paket', $paketIds)->get()->keyBy('id_paket');

        // 4. Susun Data untuk Frontend
        $rincianToken = [];
        foreach ($groupedTokens as $kodePaket => $tokens) {
            $nama = $infoPaket[$kodePaket]->nama_paket ?? 'Paket Tidak Dikenal';

            $rincianToken[] = [
                'id_paket' => $kodePaket,
                'nama_paket' => $nama,
                'total' => $tokens->count()
            ];
        }

        // Hitung total semua token
        $totalToken = $allTokens->count();

        // --- AKHIR PERBAIKAN LOGIC ---

        // 2. Ambil Riwayat Pembayaran
        $riwayat = Pembayaran::where('customer_id', $user->id_customer)
            ->with('paket')
            ->latest()
            ->get()
            ->map(function ($p) {
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
            'rincian_token' => $rincianToken, // Data array hasil olahan PHP
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
        ]);

        // 2. Setup Konfigurasi Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // Gunakan Transaction untuk atomic operation
        return DB::transaction(function () use ($request) {
            $user = Auth::guard('customer')->user();
            $paket = Paket::findOrFail($request->paket_id);

            $totalHarga = $paket->harga * $request->quantity;

            // 3. Buat ID Order Unik
            do {
                $orderId = 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));
            } while (Pembayaran::where('id_transaksi', $orderId)->exists());

            // 4. Siapkan Parameter Request Midtrans
            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => (int) $totalHarga,
                ],
                'customer_details' => [
                    'first_name' => $user->nama_lengkap,
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
                ]
            ];

            try {
                // 5. Minta Snap Token dari Midtrans
                $snapToken = Snap::getSnapToken($params);

                // 6. Simpan Transaksi ke Database
                Pembayaran::create([
                    'id_transaksi' => $orderId,
                    'customer_id' => $user->id_customer,
                    'paket_id' => $paket->id_paket,
                    'jumlah_bayar' => $totalHarga,
                    'status_pembayaran' => 'menunggu',
                    'metode_pembayaran' => 'midtrans',

                    // --- PERBAIKAN: Menambahkan waktu_dibuat ---
                    'waktu_dibuat' => now(),
                    // -------------------------------------------
                ]);

                return response()->json(['snap_token' => $snapToken]);

            } catch (\Exception $e) {
                return response()->json(['error' => 'Gagal memproses pembayaran: ' . $e->getMessage()], 500);
            }
        });
    }
}