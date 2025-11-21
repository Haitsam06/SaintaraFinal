<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\Customer;
use App\Models\Instansi; 

class AuthController extends Controller
{
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