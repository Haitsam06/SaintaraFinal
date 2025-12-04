<?php

namespace App\Http\Controllers;

use App\Mail\SendOtpMail;
use App\Models\Customer;
use App\Models\Instansi;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth; // <-- Jangan lupa import Auth
use Inertia\Inertia;

class VerifyOtpController extends Controller
{
    // Tampilkan halaman form OTP
    public function showForm(Request $request)
    {
        return Inertia::render('auth/VerifyOtp', [
            'status' => session('status'),
            'email'  => $request->query('email'),
        ]);
    }

    // Proses verifikasi OTP
    public function verify(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'otp'   => ['required', 'digits:6'],
        ]);

        // 1. Tentukan Guard dan Cari Akun
        $account = Customer::where('email', $data['email'])->first();
        $guard = 'customer';

        if (! $account) {
            $account = Instansi::where('email', $data['email'])->first();
            $guard = 'instansi';
        }

        // Jika akun tidak ditemukan di kedua tabel
        if (! $account) {
            return back()->withErrors([
                'email' => 'Akun dengan email tersebut tidak ditemukan.',
            ]);
        }

        // 2. Cek Validasi Kode OTP
        if (
            ! $account->verification_code ||
            $account->verification_code !== $data['otp'] ||
            ! $account->verification_code_expires_at ||
            $account->verification_code_expires_at->isPast()
        ) {
            return back()->withErrors([
                'otp' => 'Kode OTP salah atau sudah kedaluwarsa.',
            ]);
        }

        // 3. Update Data Akun (Verifikasi Berhasil)
        $account->email_verified_at = Carbon::now();
        $account->verification_code = null;
        $account->verification_code_expires_at = null;

        // LOGIKA STATUS:
        // Jika Customer -> Langsung Aktif
        if ($guard === 'customer') {
            $account->status_akun = 'aktif';
        } 
        // Jika Instansi -> JANGAN ubah status jadi 'aktif' dulu.
        // Biarkan statusnya tetap 'pending_payment' (sesuai create di AuthController)

        $account->save();

        // 4. Auto Login User
        Auth::guard($guard)->login($account);
        $request->session()->regenerate();

        // 5. Redirect Berdasarkan Tipe Akun
        if ($guard === 'instansi') {
            // Arahkan Instansi ke halaman pembayaran
            // Pastikan route 'payment.checkout' sudah dibuat
            return redirect()->route('instansi.activation');
        }

        // Arahkan Customer ke dashboard
        return redirect()->route('personal.dashboard');
    }

    // Kirim ulang OTP
    public function resend(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $account = Customer::where('email', $data['email'])->first()
            ?? Instansi::where('email', $data['email'])->first();

        if (! $account) {
            return back()->withErrors([
                'email' => 'Akun dengan email tersebut tidak ditemukan.',
            ]);
        }

        $otp = random_int(100000, 999999);
        $account->verification_code = $otp;
        $account->verification_code_expires_at = Carbon::now()->addMinutes(10);
        $account->save();

        Mail::to($account->email)->send(new SendOtpMail($account));

        return back()->with('status', 'Kode OTP baru telah dikirim ke email Anda.');
    }
}