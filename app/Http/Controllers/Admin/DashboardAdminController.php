<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller; // <--- INI KUNCI PERBAIKAN ERRORNYA
use App\Models\Calendar;
use App\Models\Customer;
use App\Models\Instansi;
use App\Models\Pembayaran;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardAdminController extends Controller
{
    public function index()
    {
        $currentYear = Carbon::now()->year;

        // 1. Total Transaksi (Revenue)
        $totalPendapatan = Pembayaran::whereYear('waktu_dibuat', $currentYear)
            ->where('status_pembayaran', 'berhasil')
            ->with('paket')
            ->get()
            ->sum(function ($transaksi) {
                // Pastikan tabel 'pakets' punya kolom 'harga'
                return $transaksi->paket->harga ?? 0;
            });

        // 2. Customer Aktif
        $customerAktif = Customer::where('status_akun', 'aktif')->count();

        // 3. Instansi Aktif
        $instansiAktif = Instansi::where('status_akun', 'aktif')->count();

        // 4. Agenda Mendatang (3 Terdekat)
        $agendaMendatang = Calendar::whereDate('tanggal', '>=', Carbon::now())
            ->orderBy('tanggal', 'asc')
            ->orderBy('waktu', 'asc')
            ->take(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id_kalender,
                    'title' => $item->nama_agenda,
                    'date' => Carbon::parse($item->tanggal)->translatedFormat('d F Y'),
                    'time' => $item->waktu,
                    'type' => $item->tipe
                ];
            });

        // 5. Distribusi (Mockup/Manual karena belum ada kolom kategori spesifik)
        $distribusiData = [
            'personal' => 35,
            'institution' => 45,
            'gift' => 20
        ];

        return Inertia::render('Admin/dashboard-admin', [
            'stats' => [
                'total_pendapatan' => $totalPendapatan,
                'customer_aktif' => $customerAktif,
                'instansi_aktif' => $instansiAktif,
                'agenda' => $agendaMendatang,
                'distribusi' => $distribusiData
            ]
        ]);
    }
}