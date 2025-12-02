<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

use App\Models\Pembayaran;
use App\Models\Token;

use Midtrans\Config;
use Midtrans\Notification;

class PaymentCallbackController extends Controller
{
    public function handle(Request $request)
    {
        // ---------------------------------------------------
        // 1. Setup Konfigurasi Midtrans
        // ---------------------------------------------------
        Config::$serverKey    = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = (bool) env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;

        Log::info('Midtrans callback hit', [
            'payload' => $request->all(),
        ]);

        // ---------------------------------------------------
        // 2. Tangkap & parse notifikasi dari Midtrans
        // ---------------------------------------------------
        try {
            $notif = new Notification();
        } catch (\Throwable $e) {
            // Biasanya terjadi saat "Test notification URL"
            Log::warning('Midtrans notification parse failed', [
                'error'   => $e->getMessage(),
                'payload' => $request->all(),
            ]);

            // Jangan balas 400 ke Midtrans, cukup acknowledge
            return response()->json([
                'message' => 'OK (invalid notification ignored)'
            ], 200);
        }

        $transactionStatus = $notif->transaction_status;
        $paymentType       = $notif->payment_type;
        $orderId           = $notif->order_id;
        $fraudStatus       = $notif->fraud_status ?? null;

        Log::info('Midtrans parsed notification', [
            'order_id'          => $orderId,
            'transactionStatus' => $transactionStatus,
            'paymentType'       => $paymentType,
            'fraudStatus'       => $fraudStatus,
        ]);

        // ---------------------------------------------------
        // 3. Cari Data Transaksi di tabel pembayaran
        // ---------------------------------------------------
        $pembayaran = Pembayaran::where('id_transaksi', $orderId)->first();

        if (!$pembayaran) {
            Log::warning('Midtrans callback: order not found in DB', [
                'order_id' => $orderId,
            ]);

            // Untuk keamanan, balas 200 supaya Midtrans tidak retry terus
            return response()->json([
                'message' => 'OK (order not found, ignored)',
            ], 200);
        }

        // Idempotency: kalau sudah berhasil, jangan proses lagi
        if ($pembayaran->status_pembayaran === 'berhasil') {
            Log::info('Midtrans callback: order already paid, skip', [
                'order_id' => $orderId,
            ]);

            return response()->json([
                'message' => 'OK (already paid)',
            ], 200);
        }

        // ---------------------------------------------------
        // 4. Mapping status dari Midtrans ke status_pembayaran
        // ---------------------------------------------------
        $statusPembayaran = null;

        if ($transactionStatus === 'capture') {
            if ($paymentType === 'credit_card') {
                $statusPembayaran = ($fraudStatus === 'challenge') ? 'menunggu' : 'berhasil';
            }
        } elseif ($transactionStatus === 'settlement') {
            $statusPembayaran = 'berhasil';
        } elseif ($transactionStatus === 'pending') {
            $statusPembayaran = 'menunggu';
        } elseif (
            $transactionStatus === 'deny'   ||
            $transactionStatus === 'expire' ||
            $transactionStatus === 'cancel'
        ) {
            $statusPembayaran = 'gagal';
        }

        // Safety: kalau status tidak teridentifikasi, log & ignore
        if ($statusPembayaran === null) {
            Log::warning('Midtrans callback: unknown transaction status', [
                'order_id'          => $orderId,
                'transactionStatus' => $transactionStatus,
            ]);

            return response()->json([
                'message' => 'OK (unknown status, ignored)',
            ], 200);
        }

        // ---------------------------------------------------
        // 5. Update status & Generate Token (kalau berhasil)
        // ---------------------------------------------------
        DB::beginTransaction();

        try {
            // Update status pembayaran
            $pembayaran->update([
                'status_pembayaran' => $statusPembayaran,
                'waktu_dibayar'     => ($statusPembayaran === 'berhasil') ? now() : null,
            ]);

            Log::info('Midtrans callback: pembayaran updated', [
                'order_id'          => $orderId,
                'status_pembayaran' => $statusPembayaran,
            ]);

            // ===== LOGIC GENERATE TOKEN (UNIVERSAL) =====
            if ($statusPembayaran === 'berhasil') {
                $jumlahToken = (int) $pembayaran->jumlah_token;

                for ($i = 0; $i < $jumlahToken; $i++) {

                    // Prefix: pakai paket_id
                    $prefix  = $pembayaran->paket_id;
                    $tanggal = now()->format('Ymd');

                    // Generate ID Unik
                    do {
                        $acak      = strtoupper(Str::random(5));
                        $kodeToken = $prefix . '-' . $tanggal . '-' . $acak;
                    } while (Token::where('id_token', $kodeToken)->exists());

                    // Simpan Token
                    Token::create([
                        'id_token'      => $kodeToken,
                        'pembayaran_id' => $pembayaran->id_transaksi,
                        'paket_id'      => $pembayaran->paket_id,

                        // Jika yang beli Instansi, customer_id biasanya null (dan sebaliknya)
                        'customer_id'   => $pembayaran->customer_id,
                        'instansi_id'   => $pembayaran->instansi_id,

                        'status'        => 'belum digunakan',
                        'tglPemakaian'  => null,
                    ]);
                }

                Log::info('Midtrans callback: tokens generated', [
                    'order_id'      => $orderId,
                    'jumlah_token'  => $jumlahToken,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Success',
            ], 200);

        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Payment Callback Error', [
                'order_id' => $orderId,
                'error'    => $e->getMessage(),
                'trace'    => $e->getTraceAsString(),
            ]);

            // Untuk Midtrans tetap 200, tapi error tercatat di log
            return response()->json([
                'message' => 'OK (internal error logged)',
            ], 200);
        }
    }
}
