<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

use App\Models\Pembayaran;
use App\Models\Token;
use App\Models\Instansi; // <--- [PENTING] Jangan lupa import model ini

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
            Log::warning('Midtrans notification parse failed', [
                'error'   => $e->getMessage(),
                'payload' => $request->all(),
            ]);

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
            return response()->json(['message' => 'OK (order not found, ignored)'], 200);
        }

        // Idempotency: kalau sudah berhasil, jangan proses lagi
        if ($pembayaran->status_pembayaran === 'berhasil') {
            Log::info('Midtrans callback: order already paid, skip', [
                'order_id' => $orderId,
            ]);
            return response()->json(['message' => 'OK (already paid)'], 200);
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

        if ($statusPembayaran === null) {
            Log::warning('Midtrans callback: unknown transaction status', [
                'order_id'          => $orderId,
                'transactionStatus' => $transactionStatus,
            ]);
            return response()->json(['message' => 'OK (unknown status, ignored)'], 200);
        }

        // ---------------------------------------------------
        // 5. Update status & Proses (Aktivasi / Token)
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

            // HANYA JIKA PEMBAYARAN SUKSES/SETTLEMENT
            if ($statusPembayaran === 'berhasil') {

                // ============================================================
                // A. LOGIC AKTIVASI AKUN INSTANSI (Kode Baru)
                // ============================================================
                // Cek apakah transaksi ini milik instansi
                if ($pembayaran->instansi_id) {
                    $instansi = Instansi::find($pembayaran->instansi_id);
                    
                    // Jika instansi ditemukan DAN statusnya masih 'pending_payment'
                    if ($instansi && $instansi->status_akun === 'pending') {
                        $instansi->update([
                            'status_akun' => 'aktif'
                        ]);
                        
                        Log::info('Midtrans callback: Akun Instansi berhasil diaktifkan', [
                            'instansi_id' => $instansi->id_instansi,
                            'order_id'    => $orderId
                        ]);
                    }
                }
                // ============================================================


                // ============================================================
                // B. LOGIC GENERATE TOKEN (Kode Lama - Tetap Aman)
                // ============================================================
                // Jika ini transaksi Aktivasi, biasanya jumlah_token = 0, 
                // jadi loop ini tidak akan jalan (Aman).
                // Jika ini transaksi Top Up, loop ini akan jalan.
                
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
                        'customer_id'   => $pembayaran->customer_id,
                        'instansi_id'   => $pembayaran->instansi_id,
                        'status'        => 'belum digunakan',
                        'tglPemakaian'  => null,
                    ]);
                }

                if ($jumlahToken > 0) {
                    Log::info('Midtrans callback: tokens generated', [
                        'order_id'     => $orderId,
                        'jumlah_token' => $jumlahToken,
                    ]);
                }
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

            return response()->json([
                'message' => 'OK (internal error logged)',
            ], 200);
        }
    }
}