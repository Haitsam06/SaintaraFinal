<?php

namespace App\Http\Controllers\Personal;

// --- [PENTING] BARIS INI WAJIB ADA ---
use App\Http\Controllers\Controller; 
// -------------------------------------

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
            // 2. Tangkap Notifikasi dari Midtrans
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

        // Jika sudah sukses sebelumnya, jangan diproses lagi (Idempotency)
        if ($pembayaran->status_pembayaran == 'berhasil') {
            return response()->json(['message' => 'Already paid'], 200);
        }

        // 4. Tentukan Status Transaksi
        $status = null;

        if ($transactionStatus == 'capture') {
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    $status = 'menunggu';
                } else {
                    $status = 'berhasil';
                }
            }
        } else if ($transactionStatus == 'settlement') {
            $status = 'berhasil'; // LUNAS
        } else if ($transactionStatus == 'pending') {
            $status = 'menunggu';
        } else if ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
            $status = 'gagal';
        }

        // 5. Simpan Status & Generate Token (Jika Berhasil)
        DB::beginTransaction();
        try {
            $pembayaran->update([
                'status_pembayaran' => $status
            ]);

            // === LOGIC GENERATE TOKEN ===
            if ($status == 'berhasil') {
                // Loop sebanyak jumlah token yang dibeli
                for ($i = 0; $i < $pembayaran->jumlah_token; $i++) {
                    
                    // Generate ID Token Unik
                    $prefix = $pembayaran->paket_id; // DSR/STD/PRM
                    $tanggal = now()->format('Ymd');
                    do {
                        $acak = strtoupper(Str::random(5));
                        $kodeToken = $prefix . '-' . $tanggal . '-' . $acak;
                    } while (Token::where('id_token', $kodeToken)->exists());

                    // Simpan Token
                    Token::create([
                        'id_token'      => $kodeToken,
                        'pembayaran_id' => $pembayaran->id_transaksi,
                        'customer_id'   => $pembayaran->customer_id,
                        'paket_id'      => $pembayaran->paket_id,
                        'status'        => 'belum digunakan',
                        'tglPemakaian'  => null
                    ]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Success'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error processing: ' . $e->getMessage()], 500);
        }
    }
}