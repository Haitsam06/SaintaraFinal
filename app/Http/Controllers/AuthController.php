<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin; // Pakai model Admin
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 1. Cek User berdasarkan Email
        $admin = Admin::where('email', $request->email)->first();

        // 2. Cek apakah user ada DAN password cocok
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'message' => 'Email atau Password salah'
            ], 401);
        }

        // 3. (Opsional) Cek status akun jika perlu
        if ($admin->status_akun !== 'aktif') {
            return response()->json(['message' => 'Akun Anda tidak aktif'], 403);
        }

        // 4. Buat Token
        // Parameter pertama createToken bebas string apa saja
        $token = $admin->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login sukses',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $admin
        ]);
    }

    public function logout(Request $request)
    {
        // Hapus token yang sedang digunakan
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }
}