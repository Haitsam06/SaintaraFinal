<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingInstansiController extends Controller
{
    // 1. TAMPILKAN HALAMAN SETTING
    public function index()
    {
        return Inertia::render('Instansi/Pengaturan', [
            'instansi' => Auth::guard('instansi')->user(), // Pastikan guard 'instansi' benar
        ]);
    }

    // 2. UPDATE PROFIL (Nama, Email, Alamat)
    public function updateProfile(Request $request)
    {
        $user = Auth::guard('instansi')->user();

        $validated = $request->validate([
            'nama_instansi' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:instansis,email,' . $user->id_instansi . ',id_instansi', // Sesuaikan Primary Key
            'alamat' => 'nullable|string',
            'no_telepon' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return back()->with('success', 'Profil berhasil diperbarui');
    }

    // 3. UPDATE PASSWORD
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password:instansi'], // Guard instansi
            'new_password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = Auth::guard('instansi')->user();
        
        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return back()->with('success', 'Password berhasil diubah');
    }

    // 4. HAPUS AKUN
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password:instansi'],
        ]);

        $user = Auth::guard('instansi')->user();

        Auth::guard('instansi')->logout();

        $user->delete(); // Pastikan model Instansi support SoftDeletes atau Force Delete

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}