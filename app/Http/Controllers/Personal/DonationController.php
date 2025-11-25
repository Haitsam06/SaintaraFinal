<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    public function sendToken(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'email_penerima' => 'required|email|exists:customers,email',
            'nama_penerima'  => 'required|string',
        ], [
            'email_penerima.exists' => 'Email penerima tidak terdaftar dalam sistem kami.',
        ]);

        // 2. Ambil Data Pengirim
        // Menggunakan guard 'customer' agar tidak null
        $pengirim = Auth::guard('customer')->user();

        // Safety check: Pastikan user benar-benar terdeteksi
        if (!$pengirim) {
            return back()->withErrors(['message' => 'Sesi Anda tidak valid. Silakan login kembali.']);
        }
        
        $pengirimId = $pengirim->id_customer; 

        // 3. Cari Data Penerima Berdasarkan Email
        $penerima = Customer::where('email', $request->email_penerima)->first();

        // Validasi: Tidak boleh kirim ke diri sendiri
        if ($pengirimId === $penerima->id_customer) {
            return back()->withErrors(['email_penerima' => 'Anda tidak bisa mendonasikan token ke akun sendiri.']);
        }

        // 4. Proses Pemindahan Token (Menggunakan DB Transaction)
        try {
            DB::beginTransaction();

            // A. Cari SATU token milik pengirim yang 'belum digunakan'
            // Menggunakan lockForUpdate() untuk mencegah race condition
            $token = Token::where('customer_id', $pengirimId)
                          ->where('status', 'belum digunakan')
                          ->lockForUpdate()
                          ->first();

            // B. Cek ketersediaan token
            if (!$token) {
                return back()->withErrors(['message' => 'Anda tidak memiliki token yang tersedia untuk didonasikan.']);
            }

            // C. Lakukan Transfer (Update Ownership)
            $token->customer_id = $penerima->id_customer;
            $token->save();

            DB::commit();

            return redirect()->back()->with('success', 'Berhasil mendonasikan 1 Token kepada ' . $penerima->nama_lengkap);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()]);
        }
    }
}