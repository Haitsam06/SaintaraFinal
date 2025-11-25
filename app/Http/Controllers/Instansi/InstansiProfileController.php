<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class InstansiProfileController extends Controller
{
    // Menampilkan Form
    public function edit(Request $request)
    {
        return Inertia::render('Instansi/Profile', [
            'status' => session('success'),
        ]);
    }

    // Menyimpan Data
    public function update(Request $request)
    {
        // Ambil user yang sedang login (Model Instansi)
        $user = $request->user();

        // 1. Validasi Input
        $validated = $request->validate([
            'nama_instansi' => ['required', 'string', 'max:255'],
            // Validasi email unique kecuali untuk user ini sendiri
            'email'         => ['required', 'email', 'max:255', 'unique:instansi,email,' . $user->id_instansi . ',id_instansi'],
            'no_telp'       => ['nullable', 'string', 'max:20'],
            'pic_name'      => ['nullable', 'string', 'max:100'],
            'bidang'        => ['nullable', 'string', 'max:100'],
            'alamat'        => ['nullable', 'string'],
            'foto'          => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'], // Max 2MB
        ]);

        // 2. Update Data Text
        $user->fill([
            'nama_instansi' => $validated['nama_instansi'],
            'email'         => $validated['email'],
            'no_telp'       => $validated['no_telp'] ?? null,
            'pic_name'      => $validated['pic_name'] ?? null,
            'bidang'        => $validated['bidang'] ?? null,
            'alamat'        => $validated['alamat'] ?? null,
        ]);

        // 3. Handle Upload Foto
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                Storage::disk('public')->delete($user->foto);
            }

            // Simpan foto baru ke folder 'instansi-logos' di storage public
            $path = $request->file('foto')->store('instansi-logos', 'public');
            $user->foto = $path;
        }

        // 4. Simpan ke Database
        $user->save();

        // 5. Redirect kembali
        return Redirect::route('instansi.profil')->with('success', 'Profil berhasil diperbarui.');
    }
}