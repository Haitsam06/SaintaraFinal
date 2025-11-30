<?php

namespace App\Http\Controllers; // Sebaiknya taruh di Controller utama, bukan di folder Personal

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pembayaran;
use App\Models\Token;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Midtrans\Config;
use Midtrans\Notification;

class PaymentCallbackController extends Controller
{
    public function handle(Request $request)
    {
        // 1. Setup Konfigurasi Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;

        try {
            // 2. Tangkap Notifikasi
            $notif = new Notification();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid notification'], 400);
        }

        $transactionStatus = $notif->transaction_status;
        $type = $notif->payment_type;
        $orderId = $notif->order_id;
        $fraud = $notif->fraud_status;

        // 3. Cari Data Transaksi
        $pembayaran = Pembayaran::where('id_transaksi', $orderId)->first();

        if (!$pembayaran) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Cek Idempotency (Agar tidak diproses dua kali)
        if ($pembayaran->status_pembayaran == 'berhasil') {
            return response()->json(['message' => 'Already paid'], 200);
        }

        // 4. Tentukan Status
        $status = null;
        if ($transactionStatus == 'capture') {
            if ($type == 'credit_card') {
                $status = ($fraud == 'challenge') ? 'menunggu' : 'berhasil';
            }
        } else if ($transactionStatus == 'settlement') {
            $status = 'berhasil';
        } else if ($transactionStatus == 'pending') {
            $status = 'menunggu';
        } else if ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
            $status = 'gagal';
        }

        // 5. Simpan Status & Generate Token
        DB::beginTransaction();
        try {
            // Update Status Pembayaran
            $pembayaran->update([
                'status_pembayaran' => $status,
                'waktu_dibayar'     => ($status == 'berhasil') ? now() : null,
            ]);

            // === LOGIC GENERATE TOKEN (UNIVERSAL) ===
            if ($status == 'berhasil') {
                for ($i = 0; $i < $pembayaran->jumlah_token; $i++) {
                    
                    // Generate ID Unik
                    $prefix = $pembayaran->paket_id; 
                    $tanggal = now()->format('Ymd');
                    
                    do {
                        $acak = strtoupper(Str::random(5));
                        $kodeToken = $prefix . '-' . $tanggal . '-' . $acak;
                    } while (Token::where('id_token', $kodeToken)->exists());

                    // Simpan Token
                    Token::create([
                        'id_token'      => $kodeToken,
                        'pembayaran_id' => $pembayaran->id_transaksi,
                        'paket_id'      => $pembayaran->paket_id,
                        
                        // 👇 KUNCI PERUBAHAN DI SINI 👇
                        // Kita ambil langsung dari data pembayaran.
                        // Jika yang beli Instansi, maka customer_id otomatis null (dan sebaliknya)
                        'customer_id'   => $pembayaran->customer_id, 
                        'instansi_id'   => $pembayaran->instansi_id, 
                        
                        'status'        => 'belum digunakan',
                        'tglPemakaian'  => null
                    ]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Success'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Payment Callback Error: " . $e->getMessage()); // Log error untuk debugging
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}