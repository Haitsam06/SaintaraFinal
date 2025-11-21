<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Instansi; 
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi umum (email & password) dulu
        $request->validate([
            'tipe_akun' => 'required|in:customer,instansi', // Field ini dikirim dari frontend
            'email'     => 'required|string|email|max:255',
            'password'  => ['required', 'confirmed', Rules\Password::defaults()],
            'no_telp'   => 'required|string|max:15',
            'alamat'    => 'nullable|string',
            'kota'      => 'nullable|string',
            'negara'    => 'nullable|string',
        ]);

        // 2. Logika Percabangan
        if ($request->tipe_akun === 'customer') {
            
            // Validasi Khusus Customer
            $request->validate([
                'email' => 'unique:customers,email',
                'nama_lengkap' => 'required|string|max:255',
                'nama_panggilan' => 'required|string|max:50',
            ]);

            // Generate ID Custom (Contoh: CUST-TIMESTAMP-RANDOM)
            $customId = 'CUST-' . time() . '-' . Str::random(4);

            $user = Customer::create([
                'id_customer' => $customId,
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

            // Login User (Guard harus disesuaikan jika pakai multi-guard)
            // Auth::guard('customer')->login($user); 

        } else {
            // Logic INSTANSI
            $request->validate([
                'email' => 'unique:instansi,email',
                'nama_instansi' => 'required|string|max:255',
                'bidang' => 'required|string',
                'pic_name' => 'required|string',
            ]);

            $customId = 'INST-' . time() . '-' . Str::random(4);

            $user = Instansi::create([
                'id_instansi' => $customId,
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
            
            // Auth::guard('instansi')->login($user);
        }

        // PENTING: Karena Inertia, kita redirect, bukan return JSON
        // Jika ingin auto-login, pastikan konfigurasi Guard di config/auth.php sudah benar
        
        return redirect('/login')->with('success', 'Registrasi berhasil! Silakan login.');
    }


    // Login untuk multiple user types
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = null;
        $guard = '';

        // 1. Cek di tabel ADMINS
        $user = Admin::where('email', $request->email)->first();
        if ($user) {
            $guard = 'admin';
        }

        // 2. Jika tidak ketemu, cek di tabel CUSTOMERS
        if (!$user) {
            $user = Customer::where('email', $request->email)->first();
            if ($user)
                $guard = 'customer';
        }

        // 3. Jika tidak ketemu, cek di tabel INSTANSI
        if (!$user) {
            $user = Instansi::where('email', $request->email)->first(); // Sesuaikan nama model
            if ($user)
                $guard = 'instansi';
        }

        // 4. Validasi Password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau Password salah'
            ], 401);
        }

        \Auth::guard($guard)->login($user);

        \Log::info('Guard dipakai: ' . $guard);


        // 5. Buat Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login sukses',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'role_id' => $user->role_id, // Kirim role_id untuk frontend
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }
}