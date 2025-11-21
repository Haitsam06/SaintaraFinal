<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProfileAdminController extends Controller
{
    public function update(Request $request)
    {
        // 1. Ambil User Admin yang sedang login
        $user = Auth::guard('admin')->user();

        // 2. Validasi Input
        $validated = $request->validate([
            'nama_admin' => 'required|string|max:255',
            'no_telp' => 'nullable|string|max:20',
            // Validasi Enum: Pastikan input salah satu dari 'Laki-laki' atau 'Perempuan'
            'jenis_kelamin' => ['required', Rule::in(['Laki-laki', 'Perempuan'])],
        ]);

        // 3. Update Data ke Database
        // $user di sini adalah Instance Model Admin, jadi bisa langsung update
        $user->update([
            'nama_admin' => $validated['nama_admin'],
            'no_telp' => $validated['no_telp'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
        ]);

        // 4. Redirect kembali (Inertia akan otomatis me-refresh data di frontend)
        // with('success') ini bisa ditangkap di frontend jika Anda punya komponen Flash Message
        return back()->with('success', 'Profil berhasil diperbarui!');
    }
}