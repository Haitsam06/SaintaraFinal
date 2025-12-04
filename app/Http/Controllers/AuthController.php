<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

use App\Models\Customer;
use App\Models\Instansi;
use App\Mail\SendOtpMail;

class AuthController extends Controller
{
    // --- REGISTER ---
    public function store(Request $request)
    {
        $request->validate([
            'tipe_akun' => 'required|in:customer,instansi',
            'email' => 'required|string|email|max:255',
            'password' => ['required', 'confirmed'],
            'no_telp' => 'required|string|max:15',
        ]);

        if ($request->tipe_akun === 'customer') {
            $request->validate([
                'email' => 'unique:customers,email',
                'nama_lengkap' => 'required|string|max:255',
                'nama_panggilan' => 'required|string|max:50',
            ]);

            $account = Customer::create([
                'id_customer'     => 'CUST-' . time() . '-' . Str::random(4),
                'role_id'         => 3,
                'nama_lengkap'    => $request->nama_lengkap,
                'nama_panggilan'  => $request->nama_panggilan,
                'email'           => $request->email,
                'password'        => $request->password, // auto hash (casts)
                'no_telp'         => $request->no_telp,
                'alamat'          => $request->alamat ?? null,
                'kota'            => $request->kota ?? null,
                'negara'          => $request->negara ?? null,
                'status_akun'     => 'aktif',
            ]);
        } else {
            $request->validate([
                'email'         => 'unique:instansi,email',
                'nama_instansi' => 'required|string|max:255',
                'bidang'        => 'required|string',
                'pic_name'      => 'required|string',
            ]);

            $account = Instansi::create([
                'id_instansi'   => 'INST-' . time() . '-' . Str::random(4),
                'role_id'       => 4,
                'nama_instansi' => $request->nama_instansi,
                'pic_name'      => $request->pic_name,
                'bidang'        => $request->bidang,
                'email'         => $request->email,
                'password'      => $request->password, // auto hash via casts
                'no_telp'       => $request->no_telp,
                'alamat'        => $request->alamat ?? null,
                'status_akun'   => 'pending',
            ]);
        }

        // ============================================================
        // 1. Generate OTP setelah register
        // ============================================================

        $otp = random_int(100000, 999999);

        $account->verification_code = $otp;
        $account->verification_code_expires_at = Carbon::now()->addMinutes(10);
        $account->save();

        // ============================================================
        // 2. Kirim Email OTP via Mailtrap
        // ============================================================

        Mail::to($account->email)->send(new SendOtpMail($account));

        // ============================================================
        // 3. Redirect ke halaman verifikasi OTP
        // ============================================================

        return redirect()->to('/verify-otp?email=' . urlencode($account->email))
            ->with('status', 'Kode OTP telah dikirim ke email Anda.');
    }

    // --- LOGIN ---
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required','email'],
            'password' => ['required'],
        ]);

        $remember = $request->boolean('remember');

        if (Auth::guard('admin')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            return redirect()->intended(route('admin.dashboard'));
        }

        if (Auth::guard('customer')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            return redirect()->intended(route('personal.dashboard'));
        }

        if (Auth::guard('instansi')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            return redirect()->intended(route('instansi.dashboard'));
        }

        throw ValidationException::withMessages([
            'email' => 'Email atau password salah.',
        ]);
    }

    // --- LOGOUT ---
    public function logout(Request $request)
    {
        if (Auth::guard('admin')->check()) Auth::guard('admin')->logout();
        if (Auth::guard('customer')->check()) Auth::guard('customer')->logout();
        if (Auth::guard('instansi')->check()) Auth::guard('instansi')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
