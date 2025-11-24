<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Paket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules\Password;

class PengaturanController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Pengaturan/Index');
    }

    public function umum()
    {
        // Tidak perlu kirim data settings lagi karena form kosong
        return Inertia::render('Admin/Pengaturan/Umum');
    }

    public function updateUmum(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'], // Validasi bawaan Laravel cek password lama
            'password' => ['required', 'confirmed', Password::min(8)], // Min 8 karakter, harus match dengan confirmation
        ]);

        // Update password user yang sedang login
        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password berhasil diperbarui.');
    }

    // ==========================================
    // MANAJEMEN TIM (ADMINS)
    // ==========================================
    public function indexTim()
    {
        $tim = Admin::latest('created_at')->paginate(10);
        return Inertia::render('Admin/Pengaturan/Tim', ['tim' => $tim]);
    }

    public function storeTim(Request $request)
    {
        // 1. Validasi Input
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|min:6',
            'no_telp' => 'nullable|string',
            'jenis_kelamin' => 'required|in:Pria,Wanita', // Sesuaikan opsi database
            'status_akun' => 'required|in:aktif,tidak aktif',     // Sesuaikan opsi database
        ]);

        // 2. Generate ID Otomatis (Format: ADM-001, ADM-002)
        $existingIds = Admin::pluck('id_admin')->toArray();
        $maxNumber = 0;

        foreach ($existingIds as $id) {
            // Ambil angka di akhir string (ADM-001 -> ambil 1)
            if (preg_match('/(\d+)$/', $id, $matches)) {
                $number = intval($matches[1]);
                if ($number > $maxNumber) {
                    $maxNumber = $number;
                }
            }
        }

        $nextNumber = $maxNumber + 1;
        // Format menggunakan dash (-) sesuai screenshot database Anda
        $newId = 'ADM-' . sprintf("%03d", $nextNumber);

        // 3. Simpan ke Database (UPDATE DI SINI)
        Admin::create([
            'id_admin' => $newId,
            'nama_admin' => $validated['nama'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'no_telp' => $validated['no_telp'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'status_akun' => $validated['status_akun'],
            'role_id' => 1,

            // Waktu Pembuatan Custom
            'tanggal_dibuat' => now(),

            // Waktu Bawaan Laravel (Explicitly set)
            'created_at' => now(),  // <--- TAMBAHKAN INI
            'updated_at' => now(),  // <--- TAMBAHKAN INI

            'foto' => null
        ]);

        return redirect()->back()->with('success', 'Admin berhasil ditambahkan!');
    }

    public function updateTim(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email,' . $id . ',id_admin',
            'no_telp' => 'nullable|string',
            'jenis_kelamin' => 'required',
            'status_akun' => 'required',
        ]);

        $admin->update([
            'nama_admin' => $validated['nama'],
            'email' => $validated['email'],
            'no_telp' => $validated['no_telp'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'status_akun' => $validated['status_akun'],
        ]);

        if ($request->filled('password')) {
            $admin->update(['password' => Hash::make($request->password)]);
        }

        return redirect()->back()->with('success', 'Data admin diperbarui!');
    }

    public function destroyTim($id)
    {
        Admin::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Admin dihapus!');
    }

    // ==========================================
    // JENIS TES & PAKET
    // ==========================================
    public function indexPaket()
    {
        $paket = Paket::latest()->paginate(10);
        return Inertia::render('Admin/Pengaturan/Paket', ['paket' => $paket]);
    }

    public function storePaket(Request $request)
    {
        $validated = $request->validate([
            'nama_paket' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'jumlah_karakter' => 'required|numeric',
            'deskripsi' => 'nullable|string',
        ]);

        // Generate ID: PKT001
        $lastPaket = Paket::orderBy('id_paket', 'desc')->first();
        $nextNum = $lastPaket ? intval(substr($lastPaket->id_paket, 3)) + 1 : 1;
        $newId = 'PKT' . sprintf("%03d", $nextNum);

        Paket::create([
            'id_paket' => $newId,
            'nama_paket' => $validated['nama_paket'],
            'harga' => $validated['harga'],
            'jumlah_karakter' => $validated['jumlah_karakter'],
            'deskripsi' => $validated['deskripsi'],
        ]);

        return redirect()->back()->with('success', 'Paket berhasil ditambahkan!');
    }

    public function updatePaket(Request $request, $id)
    {
        $paket = Paket::findOrFail($id);

        $validated = $request->validate([
            'nama_paket' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'jumlah_karakter' => 'required|numeric',
            'deskripsi' => 'nullable|string',
        ]);

        $paket->update($validated);

        return redirect()->back()->with('success', 'Paket diperbarui!');
    }

    public function destroyPaket($id)
    {
        Paket::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Paket dihapus!');
    }
}