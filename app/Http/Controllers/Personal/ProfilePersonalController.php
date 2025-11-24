<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfilePersonalController extends Controller
{
    public function index()
    {
        return Inertia::render('Personal/Profile');
    }

    public function update(Request $request)
    {
        $user = Auth::guard('customer')->user();

        $request->validate([
            'nama_lengkap' => 'required|string|max:100',
            'nama_panggilan' => 'nullable|string|max:50',
            'no_telp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:255',
            'negara' => 'nullable|string|max:50',
            'kota' => 'nullable|string|max:50',
            'jenis_kelamin' => 'nullable|string',
            'gol_darah' => 'nullable|string',
            'tgl_lahir' => 'nullable|date',
            'new_foto' => 'nullable|image|max:2048',
        ]);

        // Update data text
        $user->update($request->except('new_foto'));

        // Upload foto baru jika ada
        if ($request->hasFile('new_foto')) {
            $path = $request->file('new_foto')->store('foto-customer', 'public');
            $user->foto = "/storage/" . $path;
            $user->save();
        }

        return back()->with('success', 'Profil berhasil diperbarui!');
    }
}
