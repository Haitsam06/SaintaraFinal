<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingPersonalController extends Controller
{
    // 1. Tampilkan Halaman Pengaturan
    public function index()
    {
        return Inertia::render('Personal/setting', [
            // Kirim data customer yang sedang login ke frontend
            'customer' => Auth::guard('customer')->user()
        ]);
    }

    // 2. Logika Ganti Password
    public function updatePassword(Request $request)
    {
        // Validasi Input
        $validated = $request->validate([
            'current_password' => ['required', 'current_password:customer'], // Cek password lama user (guard: customer)
            'new_password'     => ['required', 'confirmed', Password::defaults()], // Confirmed = cek kesamaan dengan new_password_confirmation
        ]);

        // Update ke Database
        $user = Auth::guard('customer')->user();
        
        // Pastikan $user tidak null (untuk satisfying static analysis)
        if ($user) {
            $user->update([
                'password' => Hash::make($validated['new_password']),
            ]);
        }

        return back()->with('success', 'Password berhasil diperbarui.');
    }

    // 3. Logika Hapus Akun
    public function destroy(Request $request)
    {
        $request->validate([
            // Jika ingin lebih aman, minta password lagi disini (opsional)
            // 'password' => ['required', 'current_password:customer'],
        ]);

        $user = Auth::guard('customer')->user();

        if ($user) {
            // Logout dulu
            Auth::guard('customer')->logout();

            // Hapus data dari database
            $user->delete();

            // Invalidate session agar tidak bisa back
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return redirect('/');
    }
}