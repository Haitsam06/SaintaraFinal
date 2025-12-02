<?php

namespace App\Http\Controllers;

use App\Mail\ResetPasswordOtpMail;
use App\Models\Customer;
use App\Models\Instansi;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    // 1. Halaman form forgot-password
    public function requestForm()
    {
        return Inertia::render('auth/forgot-password', [
            'status' => session('status'),
        ]);
    }

    // 2. Proses kirim kode reset ke email
    public function sendCode(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Cari akun di Customers
        $account = Customer::where('email', $data['email'])->first()
            ?? Instansi::where('email', $data['email'])->first();

        if (! $account) {
            return back()->withErrors([
                'email' => 'Email tidak ditemukan.',
            ]);
        }

        // Generate OTP reset
        $otp = random_int(100000, 999999);

        $account->reset_password_code = $otp;
        $account->reset_password_expires_at = Carbon::now()->addMinutes(10);
        $account->save();

        // Kirim email via Mailtrap
        Mail::to($account->email)->send(new ResetPasswordOtpMail($account));

        return redirect()
            ->to('/reset-password?email=' . urlencode($account->email))
            ->with('status', 'Kode reset telah dikirim ke email Anda.');
    }

    // 3. Halaman reset password input OTP
    public function showResetForm(Request $request)
    {
        return Inertia::render('auth/reset-password', [
            'email' => $request->query('email'),
            'status' => session('status'),
        ]);
    }

    // 4. Proses ganti password
    public function reset(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'digits:6'],
            'password' => ['required', 'confirmed'],
        ]);

        $account = Customer::where('email', $data['email'])->first()
            ?? Instansi::where('email', $data['email'])->first();

        if (! $account) {
            return back()->withErrors(['email' => 'Email tidak ditemukan.']);
        }

        if (
            ! $account->reset_password_code ||
            $account->reset_password_code != $data['otp'] ||
            ! $account->reset_password_expires_at ||
            $account->reset_password_expires_at->isPast()
        ) {
            return back()->withErrors(['otp' => 'Kode OTP salah atau kadaluarsa.']);
        }

        // Ganti password
        $account->password = $data['password']; // otomatis hashed
        $account->reset_password_code = null;
        $account->reset_password_expires_at = null;
        $account->save();

        return redirect()->route('login')->with('success', 'Password berhasil direset.');
    }
}
