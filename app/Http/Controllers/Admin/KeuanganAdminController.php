<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Keuangan;
use App\Models\Pembayaran;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class KeuanganAdminController extends Controller
{
    // =================================================================
    // 1. HALAMAN PEMASUKAN
    // =================================================================
    public function indexPemasukan(Request $request)
    {
        $search = $request->input('search');

        // Query Manual
        $queryManual = DB::table('keuangans')
            ->select([
                'id_keuangan as id',
                'tanggal_transaksi',
                'deskripsi',
                'jumlah',
                DB::raw("'manual' as sumber_data")
            ])
            ->where('tipe', 'pemasukan');

        if ($search) {
            $queryManual->where(function ($q) use ($search) {
                $q->where('deskripsi', 'like', "%{$search}%")
                    ->orWhere('jumlah', 'like', "%{$search}%");
            });
        }

        // Query Otomatis (Pembayaran)
        $queryOtomatis = DB::table('pembayarans')
            ->select([
                'id_transaksi as id',
                DB::raw("DATE(waktu_dibayar) as tanggal_transaksi"),
                DB::raw("CONCAT('Pembayaran Sistem #', id_transaksi) as deskripsi"),
                'jumlah_bayar as jumlah',
                DB::raw("'otomatis' as sumber_data")
            ])
            ->where('status_pembayaran', 'berhasil');

        if ($search) {
            $queryOtomatis->where(function ($q) use ($search) {
                $q->where('id_transaksi', 'like', "%{$search}%")
                    ->orWhere('jumlah_bayar', 'like', "%{$search}%");
            });
        }

        $transaksi = $queryManual->union($queryOtomatis)
            ->orderBy('tanggal_transaksi', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Hitung Statistik
        $totalPemasukan = Keuangan::where('tipe', 'pemasukan')->sum('jumlah') +
            Pembayaran::where('status_pembayaran', 'berhasil')->sum('jumlah_bayar');

        $countBulanIni = Keuangan::where('tipe', 'pemasukan')->whereMonth('tanggal_transaksi', Carbon::now()->month)->count() +
            Pembayaran::where('status_pembayaran', 'berhasil')->whereMonth('waktu_dibayar', Carbon::now()->month)->count();

        return Inertia::render('Admin/Keuangan/Pemasukan', [
            'transaksi' => $transaksi,
            'totalPemasukan' => $totalPemasukan,
            'countBulanIni' => $countBulanIni,
            'filters' => $request->only(['search']),
        ]);
    }

    // =================================================================
    // 2. HALAMAN PENGELUARAN (UMUM + GAJI)
    // =================================================================
    public function indexPengeluaran(Request $request)
    {
        $search = $request->input('search');

        // REMOVED: ->where('kategori', '!=', 'gaji') 
        // Now it fetches ALL transactions with type 'pengeluaran'
        $query = Keuangan::where('tipe', 'pengeluaran');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('deskripsi', 'like', "%{$search}%")
                    ->orWhere('jumlah', 'like', "%{$search}%");
            });
        }

        $transaksi = $query->orderBy('tanggal_transaksi', 'desc')
            ->paginate(10)
            ->withQueryString();

        $totalPengeluaran = Keuangan::where('tipe', 'pengeluaran')->sum('jumlah');

        return Inertia::render('Admin/Keuangan/Pengeluaran', [
            'transaksi' => $transaksi,
            'totalPengeluaran' => $totalPengeluaran,
            'filters' => $request->only(['search']),
        ]);
    }
    // =================================================================
    // 3. HALAMAN LAPORAN
    // =================================================================
    public function indexLaporan(Request $request)
    {
        $year = $request->input('year', Carbon::now()->year);

        // Data Manual (Pemasukan & Pengeluaran termasuk Gaji)
        $manual = DB::table('keuangans')
            ->select(['id_keuangan', 'tanggal_transaksi', 'tipe', 'deskripsi', 'jumlah'])
            ->whereYear('tanggal_transaksi', $year)
            ->whereIn('tipe', ['pemasukan', 'pengeluaran']);

        // Data Otomatis (Pembayaran)
        $otomatis = DB::table('pembayarans')
            ->select([
                'id_transaksi as id_keuangan',
                DB::raw("DATE(waktu_dibayar) as tanggal_transaksi"),
                DB::raw("'pemasukan' as tipe"),
                DB::raw("CONCAT('Pembayaran Sistem #', id_transaksi) as deskripsi"),
                'jumlah_bayar as jumlah'
            ])
            ->where('status_pembayaran', 'berhasil')
            ->whereYear('waktu_dibayar', $year);

        $laporan = $manual->union($otomatis)
            ->orderBy('tanggal_transaksi', 'asc')
            ->get();

        $totalPemasukan = $laporan->where('tipe', 'pemasukan')->sum('jumlah');
        $totalPengeluaran = $laporan->where('tipe', 'pengeluaran')->sum('jumlah'); // Ini sudah otomatis include gaji
        $saldo = $totalPemasukan - $totalPengeluaran;

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

    // =================================================================
    // 4. HALAMAN GAJI (Logika: Tipe=Pengeluaran, Kategori=Gaji)
    // =================================================================
    public function indexGaji(Request $request)
    {
        $search = $request->input('search');

        // Filter khusus: tipe 'pengeluaran' DAN kategori 'gaji'
        $query = Keuangan::with('admin')
            ->where('tipe', 'pengeluaran')
            ->where('kategori', 'gaji');

        if ($search) {
            $query->whereHas('admin', function ($q) use ($search) {
                $q->where('nama_admin', 'like', "%{$search}%");
            });
        }

        $gaji = $query->orderBy('tanggal_transaksi', 'desc')
            ->paginate(10)
            ->withQueryString();

        $karyawan = Admin::select('id_admin', 'nama_admin', 'email')->get();

        return Inertia::render('Admin/Keuangan/Gaji', [
            'gaji' => $gaji,
            'karyawan' => $karyawan,
            'filters' => $request->only(['search']),
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
            'catatan' => 'nullable|string',
            'status' => 'required|in:pending,lunas',
        ]);

        $total = ($validated['gaji_pokok'] + ($validated['bonus'] ?? 0)) - ($validated['potongan'] ?? 0);

        $detail = [
            'gaji_pokok' => (int) $validated['gaji_pokok'],
            'bonus' => (int) ($validated['bonus'] ?? 0),
            'potongan' => (int) ($validated['potongan'] ?? 0),
        ];

        Keuangan::create([
            'id_keuangan' => (string) str()->uuid(),
            'admin_id' => $validated['admin_id'],

            // PERUBAHAN PENTING DI SINI:
            'tipe' => 'pengeluaran', // Disimpan sebagai pengeluaran
            'kategori' => 'gaji',    // Ditandai kategorinya gaji

            'tanggal_transaksi' => $validated['tanggal_gaji'],
            'deskripsi' => $validated['catatan'] ?? 'Gaji Karyawan',
            'jumlah' => $total,
            'status_pembayaran' => $validated['status'],
            'detail' => $detail,
        ]);

        return redirect()->back()->with('message', 'Data gaji berhasil disimpan');
    }

    public function updateGaji(Request $request, $id)
    {
        $keuangan = Keuangan::findOrFail($id);

        $validated = $request->validate([
            'admin_id' => 'required|exists:admins,id_admin',
            'tanggal_gaji' => 'required|date',
            'gaji_pokok' => 'required|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'potongan' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string',
            'status' => 'required|in:pending,lunas',
        ]);

        $total = ($validated['gaji_pokok'] + ($validated['bonus'] ?? 0)) - ($validated['potongan'] ?? 0);

        $detail = [
            'gaji_pokok' => (int) $validated['gaji_pokok'],
            'bonus' => (int) ($validated['bonus'] ?? 0),
            'potongan' => (int) ($validated['potongan'] ?? 0),
        ];

        $keuangan->update([
            'admin_id' => $validated['admin_id'],
            'tanggal_transaksi' => $validated['tanggal_gaji'],
            'deskripsi' => $validated['catatan'] ?? 'Gaji Karyawan',
            'jumlah' => $total,
            'status_pembayaran' => $validated['status'],
            'detail' => $detail,
            // tipe & kategori tidak perlu diupdate karena sudah pasti pengeluaran & gaji
        ]);

        return redirect()->back()->with('message', 'Data gaji berhasil diperbarui');
    }

    public function destroyGaji($id)
    {
        $keuangan = Keuangan::where('kategori', 'gaji')->findOrFail($id);
        $keuangan->delete();
        return redirect()->back()->with('message', 'Data gaji berhasil dihapus');
    }

    // =================================================================
    // CRUD GLOBAL (Untuk Pemasukan/Pengeluaran Manual Biasa)
    // =================================================================

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jumlah' => 'required|numeric|min:1',
            'deskripsi' => 'required|string|max:255',
            'tanggal_transaksi' => 'required|date',
            'tipe' => 'required|in:pemasukan,pengeluaran',
        ]);

        Keuangan::create([
            'id_keuangan' => (string) str()->uuid(),
            'tipe' => $validated['tipe'],
            'kategori' => 'umum', // Default untuk input manual biasa
            'jumlah' => $validated['jumlah'],
            'deskripsi' => $validated['deskripsi'],
            'tanggal_transaksi' => $validated['tanggal_transaksi'],
        ]);

        return redirect()->back()->with('message', 'Data berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $keuangan = Keuangan::findOrFail($id);
        $validated = $request->validate([
            'jumlah' => 'required|numeric',
            'deskripsi' => 'required|string',
            'tanggal_transaksi' => 'required|date',
        ]);

        $keuangan->update($validated);
        return redirect()->back()->with('message', 'Data berhasil diperbarui');
    }

    public function destroy($id)
    {
        $keuangan = Keuangan::findOrFail($id);
        $keuangan->delete();
        return redirect()->back()->with('message', 'Data berhasil dihapus');
    }
}