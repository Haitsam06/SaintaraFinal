<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;  // Wajib untuk DB Transaction
use Illuminate\Support\Str;         // Wajib untuk Random String
use Carbon\Carbon;                  // Wajib untuk Tanggal
use App\Models\Token;
use App\Models\Pembayaran;
use App\Models\Paket;

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
        // Query ini mengelompokkan token yang belum dipakai berdasarkan paketnya
        $rincianToken = Token::where('customer_id', $user->id_customer)
                            ->where('status', 'belum digunakan')
                            ->join('pakets', 'tokens.paket_id', '=', 'pakets.id_paket')
                            ->select('pakets.nama_paket', 'pakets.id_paket', DB::raw('count(*) as total'))
                            ->groupBy('pakets.id_paket', 'pakets.nama_paket')
                            ->get();

        // Hitung total semua token dari hasil rincian di atas
        $totalToken = $rincianToken->sum('total');

        // 2. Ambil Riwayat Pembayaran (Sama seperti sebelumnya)
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
                                'status' => $p->status_pembayaran,
                            ];
                        });

        // 3. Ambil Daftar Paket
        $daftarPaket = Paket::all();

        return Inertia::render('Personal/transaksi-token', [
            'saldo_token' => $totalToken, // Tetap kirim total
            'rincian_token' => $rincianToken, // <--- DATA BARU: Array rincian
            'riwayat' => $riwayat,
            'daftar_paket' => $daftarPaket
        ]);
    }

    /**
     * Memproses pembelian: Buat Invoice -> Generate Token -> Simpan
     */
    public function checkout(Request $request)
    {
        // 1. Validasi Input dari React
        $request->validate([
            'paket_id' => 'required|exists:pakets,id_paket',
            'quantity' => 'required|integer|min:1',
        ]);

        // Gunakan DB Transaction agar data aman (Atomicity)
        // Jika ada error di tengah jalan, semua perubahan dibatalkan (rollback)
        return DB::transaction(function () use ($request) {
            $user = Auth::guard('customer')->user();
            
            // Ambil Data Paket untuk hitung harga
            $paket = Paket::findOrFail($request->paket_id);
            $totalHarga = $paket->harga * $request->quantity;

            // 2. Buat ID Transaksi Unik (Invoice)
            // Format: INV-20251123-ACAK
            $invoiceId = 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));

            // Pastikan ID Invoice benar-benar unik
            while (Pembayaran::where('id_transaksi', $invoiceId)->exists()) {
                $invoiceId = 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));
            }

            // 3. Simpan Data Pembayaran (Status langsung 'berhasil' untuk simulasi)
            $pembayaran = Pembayaran::create([
                'id_transaksi'      => $invoiceId,
                'customer_id'       => $user->id_customer,
                'paket_id'          => $paket->id_paket,
                'jumlah_bayar'      => $totalHarga,
                'status_pembayaran' => 'berhasil', // Ceritanya langsung lunas
                'metode_pembayaran' => 'manual_test',
                'waktu_dibayar'     => now(),
            ]);

            // 4. LOOPING GENERATE TOKEN
            // Membuat token sejumlah quantity yang dibeli
            for ($i = 0; $i < $request->quantity; $i++) {
                
                // Format ID Token: DSR-20251123-X7K9
                $prefix = $paket->id_paket; // DSR / STD / PRM
                $tanggal = now()->format('Ymd');
                $acak = strtoupper(Str::random(5));
                $kodeToken = $prefix . '-' . $tanggal . '-' . $acak;

                // Pastikan Token Unik (Cek database, kalau ada, generate ulang)
                while(Token::where('id_token', $kodeToken)->exists()){
                    $acak = strtoupper(Str::random(5));
                    $kodeToken = $prefix . '-' . $tanggal . '-' . $acak;
                }

                // Simpan Token ke Database
                Token::create([
                    'id_token'      => $kodeToken,
                    'pembayaran_id' => $pembayaran->id_transaksi,
                    'customer_id'   => $user->id_customer,
                    'paket_id'      => $paket->id_paket, // Penting agar tau ini token paket apa
                    'status'        => 'belum digunakan',
                ]);
            }

            // 5. Kembali ke halaman sebelumnya dengan pesan sukses
            return redirect()->back()->with('success', 'Pembelian berhasil! Token Anda sudah aktif.');
        });
    }
}