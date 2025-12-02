<?php

namespace App\Http\Controllers;

use App\Mail\SendOtpMail;
use App\Models\Customer;
use App\Models\Instansi;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class VerifyOtpController extends Controller
{
    // Tampilkan halaman form OTP
    public function showForm(Request $request)
    {
        return Inertia::render('auth/VerifyOtp', [ // <- sesuaikan dengan folder resources/js/pages/auth
            'status' => session('status'),
            'email'  => $request->query('email'),   // <- ambil email dari query string (?email=...)
        ]);
    }

    // Proses verifikasi OTP
    public function verify(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'otp'   => ['required', 'digits:6'],
        ]);

        // Cari akun di customers dulu
        $account = Customer::where('email', $data['email'])->first();

        // Kalau tidak ketemu, coba di instansi
        if (! $account) {
            $account = Instansi::where('email', $data['email'])->first();
        }

        if (! $account) {
            return back()->withErrors([
                'email' => 'Akun dengan email tersebut tidak ditemukan.',
            ]);
        }

        // Cek kode & expired
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

        // OTP valid → tandai terverifikasi
        $account->email_verified_at = Carbon::now();
        $account->verification_code = null;
        $account->verification_code_expires_at = null;
        // kalau mau, pastikan status akun aktif
        if (property_exists($account, 'status_akun')) {
            $account->status_akun = 'aktif';
        }
        $account->save();

        return redirect()
            ->route('login')
            ->with('success', 'Email berhasil diverifikasi. Silakan login.');
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
