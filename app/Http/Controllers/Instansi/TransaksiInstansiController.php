<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

// Import Models
use App\Models\Instansi; // Sesuai file yang kamu kirim
use App\Models\Token;
use App\Models\Pembayaran;
use App\Models\Paket;

// Midtrans SDK
use Midtrans\Config;
use Midtrans\Snap;

class TransaksiInstansiController extends Controller
{
    /**
     * Menampilkan halaman transaksi & dompet instansi.
     */
    public function index()
    {
        // 1. Ambil data Instansi yang sedang login
        // Pastikan di config/auth.php guard 'instansi' menggunakan provider yang mengarah ke App\Models\Instansi
        $instansi = Auth::guard('instansi')->user(); 

        if (!$instansi) {
            return redirect()->route('login'); // Sesuaikan route login instansi kamu
        }

        // 2. Ambil Rincian Token (Group by Paket)
        // Asumsi: Tabel 'tokens' punya kolom 'instansi_id'
        $rincianToken = Token::where('instansi_id', $instansi->id_instansi) 
                            ->where('status', 'belum digunakan')
                            ->join('pakets', 'tokens.paket_id', '=', 'pakets.id_paket')
                            ->select('pakets.nama_paket', 'pakets.id_paket', DB::raw('count(*) as total'))
                            ->groupBy('pakets.id_paket', 'pakets.nama_paket')
                            ->get();

        $totalToken = $rincianToken->sum('total');

        // 3. Ambil Riwayat Pembayaran
        // Asumsi: Tabel 'pembayarans' punya kolom 'instansi_id'
        $riwayat = Pembayaran::where('instansi_id', $instansi->id_instansi)
                            ->with('paket')
                            ->latest()
                            ->get()
                            ->map(function($p) {
                                return [
                                    'id' => $p->id_transaksi,
                                    'nama_paket' => $p->paket->nama_paket ?? 'Paket Tidak Dikenal',
                                    'tanggal' => $p->created_at->translatedFormat('d M Y'),
                                    'jumlah_bayar' => (int) $p->jumlah_bayar,
                                    'status' => $p->status_pembayaran,
                                ];
                            });

        // 4. Ambil Daftar Semua Paket (INI YANG BIKIN MODAL KOSONG KEMARIN)
        $daftarPaket = Paket::all();

        // 5. Kirim ke Frontend
        return Inertia::render('Instansi/Transaksi', [ // Pastikan path file .tsx benar
            'saldo_token'   => $totalToken,
            'rincian_token' => $rincianToken,
            'riwayat'       => $riwayat,
            'daftar_paket'  => $daftarPaket, 
            'instansi_nama' => $instansi->nama_instansi, // Diambil dari model Instansi.php
        ]);
    }

    /**
     * Proses Checkout (Request Token Snap Midtrans)
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'paket_id' => 'required|exists:pakets,id_paket',
            'quantity' => 'required|integer|min:1',
        ]);

        // Setup Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
        
        return DB::transaction(function () use ($request) {
            // Ambil data instansi
            $instansi = Auth::guard('instansi')->user();
            $paket = Paket::findOrFail($request->paket_id);
            
            // Hitung Total
            $totalHarga = $paket->harga * $request->quantity;
            
            // Generate Order ID (Contoh: INST-20251130-AB12C)
            do {
                $orderId = 'INST-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));
            } while (Pembayaran::where('id_transaksi', $orderId)->exists());

            // Siapkan Parameter Midtrans
            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => (int) $totalHarga,
                ],
                // Data Customer diambil dari Model Instansi
                'customer_details' => [
                    'first_name' => $instansi->nama_instansi, 
                    'email' => $instansi->email,     
                    'phone' => $instansi->no_telp, // Dari model Instansi.php
                ],
                'item_details' => [
                    [
                        'id' => $paket->id_paket,
                        'price' => (int) $paket->harga,
                        'quantity' => (int) $request->quantity,
                        'name' => $paket->nama_paket,
                    ]
                ],
            ];

            try {
                // Minta Snap Token
                $snapToken = Snap::getSnapToken($params);

                // Simpan ke Database
                Pembayaran::create([
                    'id_transaksi'      => $orderId,
                    'instansi_id'       => $instansi->id_instansi, // PENTING: Foreign Key ke tabel Instansi
                    'paket_id'          => $paket->id_paket,
                    'jumlah_token'      => $request->quantity,
                    'jumlah_bayar'      => $totalHarga,
                    'status_pembayaran' => 'menunggu',
                    'metode_pembayaran' => 'midtrans',
                    'url_pembayaran'    => $snapToken,
                ]);

                return response()->json(['snap_token' => $snapToken]);

            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });
    }
}