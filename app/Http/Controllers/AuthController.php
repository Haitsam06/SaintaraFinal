<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\Customer;
use App\Models\Instansi;
// use App\Models\Admin; // Tidak perlu dipanggil langsung di sini karena lewat Auth Guard

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

            Customer::create([
                'id_customer' => 'CUST-' . time() . '-' . Str::random(4),
                'role_id' => 3,
                'nama_lengkap' => $request->nama_lengkap,
                'nama_panggilan' => $request->nama_panggilan,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'no_telp' => $request->no_telp,
                'alamat' => $request->alamat,
                'kota' => $request->kota,
                'negara' => $request->negara,
                'status_akun' => 'aktif',
            ]);
        } else {
            $request->validate([
                'email' => 'unique:instansi,email', // Sesuaikan nama tabel instansi
                'nama_instansi' => 'required|string|max:255',
                'bidang' => 'required|string',
                'pic_name' => 'required|string',
            ]);

            Instansi::create([
                'id_instansi' => 'INST-' . time() . '-' . Str::random(4),
                'role_id' => 4,
                'nama_instansi' => $request->nama_instansi,
                'pic_name' => $request->pic_name,
                'bidang' => $request->bidang,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'no_telp' => $request->no_telp,
                'alamat' => $request->alamat,
                'status_akun' => 'aktif',
            ]);
        }

        return redirect()->route('login')->with('success', 'Registrasi berhasil! Silakan login.');
    }

    // --- LOGIN (SESSION) ---
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $remember = $request->boolean('remember');

        // 1. Cek Login Admin
        if (Auth::guard('admin')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            // Redirect KHUSUS ke route admin
            return redirect()->intended(route('admin.dashboard'));
        }

        // 2. Cek Login Customer
        if (Auth::guard('customer')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            // Redirect KHUSUS ke route personal
            return redirect()->intended(route('personal.dashboard'));
        }

        // 3. Cek Login Instansi
        if (Auth::guard('instansi')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            // Redirect KHUSUS ke route instansi
            return redirect()->intended(route('instansi.dashboard'));
        }

        // Jika gagal semua
        throw ValidationException::withMessages([
            'email' => 'Email atau password salah.',
        ]);
    }

    // --- LOGOUT ---
    public function logout(Request $request)
    {
        // Logout dari guard manapun yang aktif
        if (Auth::guard('admin')->check())
            Auth::guard('admin')->logout();
        if (Auth::guard('customer')->check())
            Auth::guard('customer')->logout();
        if (Auth::guard('instansi')->check())
            Auth::guard('instansi')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}