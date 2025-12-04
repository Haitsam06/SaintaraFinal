<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Str; <--- Hapus ini pun tidak masalah jika pakai str()
use App\Models\Pembayaran;
use App\Models\Paket;
use Midtrans\Config;
use Midtrans\Snap;

class ActivationController extends Controller
{
    public function __construct()
    {
        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = (bool) env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;
    }

    public function show()
    {
        $instansi = Auth::guard('instansi')->user();

        // Guard: Jika sudah aktif, lempar ke dashboard
        if ($instansi->status_akun === 'aktif') {
            return redirect()->route('instansi.dashboard');
        }

        // 1. Tentukan Harga Aktivasi
        $paketRef = Paket::where('nama_paket', 'LIKE', '%Aktivasi%')->first();
        
        $harga    = $paketRef ? $paketRef->harga : 40000000;
        $namaItem = "Biaya Aktivasi Akun Instansi";

        // 2. Cek Transaksi Pending 
        // Logika: Cari pembayaran milik instansi ini, status menunggu, dan paket_id NULL
        $existingTrans = Pembayaran::where('instansi_id', $instansi->id_instansi)
            ->where('status_pembayaran', 'menunggu')
            ->whereNull('paket_id') // <--- Pastikan logic ini sesuai migrate baru
            ->latest()
            ->first();

        $snapToken = $existingTrans ? $existingTrans->url_pembayaran : null;

        // 3. Buat Transaksi Baru jika belum ada
        if (!$snapToken) {
            
            // PERUBAHAN DI SINI:
            // Kita pakai helper str()->random() agar tidak perlu import class Str di atas.
            $orderId = 'ACT-' . now()->format('ymd') . '-' . strtoupper(str()->random(5));

            $params = [
                'transaction_details' => [
                    'order_id'     => $orderId,
                    'gross_amount' => (int) $harga,
                ],
                'customer_details' => [
                    'first_name' => $instansi->nama_instansi,
                    'email'      => $instansi->email,
                    'phone'      => $instansi->no_telp,
                ],
                'item_details' => [[
                    'id'       => 'ACTIVATION',
                    'price'    => (int) $harga,
                    'quantity' => 1,
                    'name'     => $namaItem,
                ]],
            ];

            try {
                $snapToken = Snap::getSnapToken($params);

                Pembayaran::create([
                    'id_transaksi'      => $orderId,
                    'instansi_id'       => $instansi->id_instansi,
                    'paket_id'          => null, // Nullable (Sesuai migrate baru)
                    'jumlah_token'      => 0,
                    'jumlah_bayar'      => $harga,
                    'status_pembayaran' => 'menunggu',
                    'metode_pembayaran' => 'midtrans',
                    'url_pembayaran'    => $snapToken,
                ]);
            } catch (\Exception $e) {
                return back()->withErrors(['error' => 'Gagal koneksi payment gateway: ' . $e->getMessage()]);
            }
        }

        return Inertia::render('auth/InstansiCheckout', [
            'instansi' => [
                'nama_instansi' => $instansi->nama_instansi,
                'email'         => $instansi->email,
                'pic_name'      => $instansi->pic_name,
            ],
            'bill' => [
                'description'      => $namaItem,
                'amount'           => (int) $harga,
                'formatted_amount' => 'Rp ' . number_format($harga, 0, ',', '.'),
            ],
            'snap_token' => $snapToken,
        ]);
    }
}