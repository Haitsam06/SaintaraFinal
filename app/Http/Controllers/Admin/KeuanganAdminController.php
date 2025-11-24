<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Keuangan;
use App\Models\Admin; // Pastikan model Admin di-import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class KeuanganAdminController extends Controller
{
    public function indexPemasukan()
    {
        $transaksi = Keuangan::where('tipe', 'pemasukan')
            ->latest('tanggal_transaksi')
            ->paginate(10);

        $totalPemasukan = Keuangan::where('tipe', 'pemasukan')->sum('jumlah');
        $countBulanIni = Keuangan::where('tipe', 'pemasukan')
            ->whereMonth('tanggal_transaksi', now()->month)
            ->count();

        return Inertia::render('Admin/Keuangan/Pemasukan', [
            'transaksi' => $transaksi,
            'totalPemasukan' => $totalPemasukan,
            'countBulanIni' => $countBulanIni
        ]);
    }

    public function indexPengeluaran()
    {
        $transaksi = Keuangan::where('tipe', 'pengeluaran')
            ->latest('tanggal_transaksi')
            ->paginate(10);

        $totalPengeluaran = Keuangan::where('tipe', 'pengeluaran')->sum('jumlah');

        return Inertia::render('Admin/Keuangan/Pengeluaran', [
            'transaksi' => $transaksi,
            'totalPengeluaran' => $totalPengeluaran
        ]);
    }

    public function indexLaporan(Request $request)
    {
        $year = $request->input('year', now()->year);
        $query = Keuangan::whereYear('tanggal_transaksi', $year);

        $totalPemasukan = (clone $query)->where('tipe', 'pemasukan')->sum('jumlah');
        $totalPengeluaran = (clone $query)->where('tipe', 'pengeluaran')->sum('jumlah');
        $saldo = $totalPemasukan - $totalPengeluaran;

        $laporan = $query->orderBy('tanggal_transaksi', 'desc')->get();

        return Inertia::render('Admin/Keuangan/Laporan', [
            'laporan' => $laporan,
            'summary' => [
                'total_pemasukan' => $totalPemasukan,
                'total_pengeluaran' => $totalPengeluaran,
                'saldo' => $saldo
            ],
            'filters' => ['year' => $year]
        ]);
    }

    public function printLaporan(Request $request)
    {
        $year = $request->input('year', now()->year);
        $query = Keuangan::whereYear('tanggal_transaksi', $year);

        $totalPemasukan = (clone $query)->where('tipe', 'pemasukan')->sum('jumlah');
        $totalPengeluaran = (clone $query)->where('tipe', 'pengeluaran')->sum('jumlah');
        $saldo = $totalPemasukan - $totalPengeluaran;

        $laporan = $query->orderBy('tanggal_transaksi', 'asc')->get();

        return Inertia::render('Admin/Keuangan/CetakLaporan', [
            'laporan' => $laporan,
            'summary' => [
                'total_pemasukan' => $totalPemasukan,
                'total_pengeluaran' => $totalPengeluaran,
                'saldo' => $saldo
            ],
            'year' => $year,
            'company_name' => 'SAINTARA'
        ]);
    }

    // ==========================================
    //  FITUR GAJI (INI YANG SEBELUMNYA HILANG)
    // ==========================================

    public function indexGaji()
    {
        // Filter Keuangan yang kategorinya 'gaji'
        $gaji = Keuangan::where('kategori', 'gaji')
            ->with('admin') // Load data karyawan
            ->latest('tanggal_transaksi')
            ->paginate(10);

        // Ambil list karyawan (role_id = 2) untuk dropdown
        $karyawan = Admin::where('role_id', 2)
            ->select('id_admin', 'nama_admin', 'email')
            ->get();

        return Inertia::render('Admin/Keuangan/Gaji', [
            'gaji' => $gaji,
            'karyawan' => $karyawan
        ]);
    }

    public function storeGaji(Request $request)
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:admins,id_admin',
            'tanggal_gaji' => 'required|date',
            'gaji_pokok' => 'required|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'potongan' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string'
        ]);

        $total = $validated['gaji_pokok'] + ($validated['bonus'] ?? 0) - ($validated['potongan'] ?? 0);

        Keuangan::create([
            'tipe' => 'pengeluaran',
            'kategori' => 'gaji',
            'jumlah' => $total,
            'tanggal_transaksi' => $validated['tanggal_gaji'],
            'admin_id' => $validated['admin_id'],
            'status_pembayaran' => 'pending', // Default
            'deskripsi' => $validated['catatan'] ?? 'Gaji Karyawan',
            'detail' => [
                'gaji_pokok' => $validated['gaji_pokok'],
                'bonus' => $validated['bonus'] ?? 0,
                'potongan' => $validated['potongan'] ?? 0,
            ]
        ]);

        return redirect()->back()->with('success', 'Penggajian berhasil disimpan!');
    }

    public function updateGaji(Request $request, $id)
    {
        $keuangan = Keuangan::findOrFail($id);

        $validated = $request->validate([
            'gaji_pokok' => 'required|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'potongan' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string'
        ]);

        $total = $validated['gaji_pokok'] + ($validated['bonus'] ?? 0) - ($validated['potongan'] ?? 0);

        $keuangan->update([
            'jumlah' => $total,
            'deskripsi' => $validated['catatan'],
            'detail' => [
                'gaji_pokok' => $validated['gaji_pokok'],
                'bonus' => $validated['bonus'] ?? 0,
                'potongan' => $validated['potongan'] ?? 0,
            ]
        ]);

        return redirect()->back()->with('success', 'Data gaji diperbarui!');
    }

    public function destroyGaji($id)
    {
        Keuangan::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data gaji dihapus!');
    }

    // ==========================================
    //  CRUD MANUAL (Pemasukan/Pengeluaran Umum)
    // ==========================================

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipe' => 'required|in:pemasukan,pengeluaran',
            'jumlah' => 'required|numeric|min:0',
            'tanggal_transaksi' => 'required|date',
            'deskripsi' => 'required|string|max:255',
        ]);

        Keuangan::create([
            'tipe' => $validated['tipe'],
            'kategori' => 'umum',
            'jumlah' => $validated['jumlah'],
            'tanggal_transaksi' => $validated['tanggal_transaksi'],
            'deskripsi' => $validated['deskripsi'],
        ]);

        return redirect()->back()->with('success', 'Data berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $keuangan = Keuangan::findOrFail($id);

        $validated = $request->validate([
            'jumlah' => 'required|numeric|min:0',
            'tanggal_transaksi' => 'required|date',
            'deskripsi' => 'required|string|max:255',
        ]);

        $keuangan->update([
            'jumlah' => $validated['jumlah'],
            'tanggal_transaksi' => $validated['tanggal_transaksi'],
            'deskripsi' => $validated['deskripsi'],
        ]);

        return redirect()->back()->with('success', 'Data berhasil diperbarui!');
    }

    public function destroy($id)
    {
        Keuangan::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data berhasil dihapus!');
    }
}