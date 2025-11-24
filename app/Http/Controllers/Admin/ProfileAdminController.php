<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; // <--- JANGAN LUPA IMPORT INI
use Illuminate\Validation\Rule;

class ProfileAdminController extends Controller
{
    public function update(Request $request)
    {
        $user = Auth::guard('admin')->user();

        // 1. Validasi Input (Tambahkan validasi foto)
        $validated = $request->validate([
            'nama_admin' => 'required|string|max:255',
            'no_telp' => 'nullable|string|max:20',
            'jenis_kelamin' => ['required', Rule::in(['Pria', 'Wanita'])],
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        // 2. Siapkan data update dasar
        $dataToUpdate = [
            'nama_admin' => $validated['nama_admin'],
            'no_telp' => $validated['no_telp'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
        ];

        // 3. Cek apakah ada file foto yang diupload
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada (dan bukan default/null)
            if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                Storage::disk('public')->delete($user->foto);
            }

            // Simpan foto baru ke folder 'admins' di storage public
            $path = $request->file('foto')->store('admins', 'public');

            // Simpan path-nya saja (contoh: admins/namafile.jpg)
            $dataToUpdate['foto'] = $path;
        }

        // 4. Update Database
        $user->update($dataToUpdate);

        return back()->with('success', 'Profil berhasil diperbarui!');
    }
}