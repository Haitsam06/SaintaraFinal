<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Instansi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PenggunaAdminController extends Controller
{
    public function indexPersonal(Request $request)
    {
        $search = $request->input('search');
        $query = Customer::query();

        if ($search) {
            $query->where('nama_lengkap', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Pengguna/Personal', [
            'users' => $users,
            'filters' => ['search' => $search]
        ]);
    }

    public function indexInstansi(Request $request)
    {
        $search = $request->input('search');
        $query = Instansi::query();

        if ($search) {
            $query->where('nama_instansi', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Pengguna/Instansi', [
            'users' => $users,
            'filters' => ['search' => $search]
        ]);
    }

    public function store(Request $request)
    {
        $tab = $request->input('tab_type');

        if ($tab === 'Instansi') {
            // === LOGIKA INSTANSI (FIXED) ===

            // 1. Validasi Input
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'email' => 'required|email|unique:instansi,email',
                'password' => 'required|min:6',
                'no_telp' => 'nullable|string',
                'alamat' => 'nullable|string', // Tambahan
                'bidang' => 'nullable|string', // Tambahan
            ]);

            // 2. Generate ID Otomatis (INS001, INS002...)
            $existingIds = Instansi::pluck('id_instansi')->toArray();
            $maxNumber = 0;

            foreach ($existingIds as $id) {
                // Ambil angka di akhir string (INS001 -> 1)
                if (preg_match('/(\d+)$/', $id, $matches)) {
                    $number = intval($matches[1]);
                    if ($number > $maxNumber) {
                        $maxNumber = $number;
                    }
                }
            }
            $nextNumber = $maxNumber + 1;
            $newId = 'INST-' . time() . '-' . Str::random(4); // Prefix INS sesuai screenshot

            // 3. Simpan ke Database
            Instansi::create([
                'id_instansi' => $newId,
                'role_id' => 4, // Sesuai screenshot (Role ID 4)
                'nama_instansi' => $validated['nama'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'no_telp' => $validated['no_telp'],
                'alamat' => $validated['alamat'] ?? null,
                'bidang' => $validated['bidang'] ?? null,
                'tanggal_dibuat' => now(), // Isi otomatis hari ini
                'status_akun' => 'aktif'
            ]);

        } else {
            // === LOGIKA CUSTOMER (FIXED) ===

            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'nama_panggilan' => 'nullable|string|max:50',
                'email' => 'required|email|unique:customers,email',
                'password' => 'required|min:6',
                'no_telp' => 'nullable|string',
                'alamat' => 'nullable|string',
                'kota' => 'nullable|string',
                'negara' => 'nullable|string',
                'tgl_lahir' => 'nullable|date',
                'jenis_kelamin' => 'nullable|string',
                'gol_darah' => 'nullable|string',
            ]);

            // Generate ID Customer (CUST001...)
            $existingIds = Customer::pluck('id_customer')->toArray();
            $maxNumber = 0;
            foreach ($existingIds as $id) {
                if (preg_match('/(\d+)$/', $id, $matches)) {
                    $number = intval($matches[1]);
                    if ($number > $maxNumber) {
                        $maxNumber = $number;
                    }
                }
            }
            $nextNumber = $maxNumber + 1;
            $newId = 'CUST-' . time() . '-' . Str::random(4);

            Customer::create([
                'id_customer' => $newId,
                'role_id' => 3,
                'nama_lengkap' => $validated['nama'],
                'nama_panggilan' => $validated['nama_panggilan'] ?? null,
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'no_telp' => $validated['no_telp'] ?? null,
                'alamat' => $validated['alamat'] ?? null,
                'kota' => $validated['kota'] ?? null,
                'negara' => $validated['negara'] ?? null,
                'tgl_lahir' => $validated['tgl_lahir'] ?? null,
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                'gol_darah' => $validated['gol_darah'] ?? null,
                'status_akun' => 'aktif',
                'foto' => null
            ]);
        }

        return redirect()->back()->with('success', 'Data berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $tab = $request->input('tab_type');

        if ($tab === 'Instansi') {
            $user = Instansi::findOrFail($id);

            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'email' => 'required|email|unique:instansi,email,' . $id . ',id_instansi',
                'no_telp' => 'nullable|string',
                'alamat' => 'nullable|string',
                'bidang' => 'nullable|string',
                'status_akun' => 'nullable|string',
            ]);

            $user->update([
                'nama_instansi' => $validated['nama'],
                'email' => $validated['email'],
                'no_telp' => $validated['no_telp'],
                'alamat' => $validated['alamat'],
                'bidang' => $validated['bidang'],
                'status_akun' => $validated['status_akun'] ?? $user->status_akun,
            ]);

            if ($request->filled('password')) {
                $user->update(['password' => Hash::make($request->password)]);
            }

        } else {
            $user = Customer::findOrFail($id);

            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'nama_panggilan' => 'nullable|string',
                'email' => 'required|email|unique:customers,email,' . $id . ',id_customer',
                'no_telp' => 'nullable|string',
                'alamat' => 'nullable|string',
                'kota' => 'nullable|string',
                'negara' => 'nullable|string',
                'tgl_lahir' => 'nullable|date',
                'jenis_kelamin' => 'nullable|string',
                'gol_darah' => 'nullable|string',
            ]);

            $user->update([
                'nama_lengkap' => $validated['nama'],
                'nama_panggilan' => $validated['nama_panggilan'] ?? $user->nama_panggilan,
                'email' => $validated['email'],
                'no_telp' => $validated['no_telp'],
                'alamat' => $validated['alamat'],
                'kota' => $validated['kota'],
                'negara' => $validated['negara'],
                'tgl_lahir' => $validated['tgl_lahir'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'gol_darah' => $validated['gol_darah'],
            ]);

            if ($request->filled('password')) {
                $user->update(['password' => Hash::make($request->password)]);
            }
        }

        return redirect()->back()->with('success', 'Data berhasil diperbarui!');
    }

    public function destroy(Request $request, $id)
    {
        $tab = $request->input('tab_type');

        if ($tab === 'Instansi') {
            Instansi::findOrFail($id)->delete();
        } else {
            Customer::findOrFail($id)->delete();
        }

        return redirect()->back()->with('success', 'Data berhasil dihapus!');
    }
}