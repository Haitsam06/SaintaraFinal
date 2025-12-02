<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use App\Models\Instansi;
use App\Models\Token;
use App\Models\Pembayaran;
use App\Models\Paket;

use Midtrans\Config;
use Midtrans\Snap;

class TransaksiInstansiController extends Controller
{
    /**
     * Halaman Dompet & Transaksi Instansi
     */
    public function index(Request $request)
    {
        $instansi = Auth::guard('instansi')->user();

        if (!$instansi) {
            return redirect()->route('login');
        }

        // 1. Rincian token per paket (belum digunakan saja)
        $rincianToken = Token::where('instansi_id', $instansi->id_instansi)
            ->where('status', 'belum digunakan') // SESUAI ENUM
            ->join('pakets', 'tokens.paket_id', '=', 'pakets.id_paket')
            ->select('pakets.nama_paket', 'pakets.id_paket', DB::raw('COUNT(*) as total'))
            ->groupBy('pakets.id_paket', 'pakets.nama_paket')
            ->get();

        // Total saldo aktif instansi
        $totalToken = $rincianToken->sum('total');

        // 2. Riwayat pembayaran instansi ini
        $riwayat = Pembayaran::where('instansi_id', $instansi->id_instansi)
            ->with('paket')
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id'           => $p->id_transaksi,
                    'nama_paket'   => $p->paket->nama_paket ?? 'Paket Tidak Dikenal',
                    'tanggal'      => $p->created_at->translatedFormat('d M Y'),
                    'jumlah_bayar' => (int) $p->jumlah_bayar,
                    'status'       => $p->status_pembayaran,
                ];
            });

        // 3. Daftar paket yang tersedia (untuk top up)
        $daftarPaket = Paket::all();

        // 4. Ringkasan batch peserta (kalau kamu pakai session ini)
        $batch = $request->session()->get('instansi_batch');

        return Inertia::render('Instansi/Transaksi', [
            'saldo_token'   => $totalToken,
            'rincian_token' => $rincianToken,
            'riwayat'       => $riwayat,
            'daftar_paket'  => $daftarPaket,
            'instansi_nama' => $instansi->nama_instansi,
            'batch'         => $batch,
        ]);
    }

    /**
     * Checkout (Midtrans Snap) – tetap seperti semula
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'paket_id' => 'required|exists:pakets,id_paket',
            'quantity' => 'required|integer|min:1',
        ]);

        // Konfigurasi Midtrans
        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;

        return DB::transaction(function () use ($request) {
            $instansi = Auth::guard('instansi')->user();
            $paket    = Paket::findOrFail($request->paket_id);

            $totalHarga = $paket->harga * $request->quantity;

            // Generate order id unik
            do {
                $orderId = 'INST-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));
            } while (Pembayaran::where('id_transaksi', $orderId)->exists());

            $params = [
                'transaction_details' => [
                    'order_id'     => $orderId,
                    'gross_amount' => (int) $totalHarga,
                ],
                'customer_details' => [
                    'first_name' => $instansi->nama_instansi,
                    'email'      => $instansi->email,
                    'phone'      => $instansi->no_telp,
                ],
                'item_details' => [
                    [
                        'id'       => $paket->id_paket,
                        'price'    => (int) $paket->harga,
                        'quantity' => (int) $request->quantity,
                        'name'     => $paket->nama_paket,
                    ],
                ],
            ];

            try {
                $snapToken = Snap::getSnapToken($params);

                Pembayaran::create([
                    'id_transaksi'      => $orderId,
                    'instansi_id'       => $instansi->id_instansi,
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
