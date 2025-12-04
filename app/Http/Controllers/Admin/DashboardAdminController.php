<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Calendar;
use App\Models\Customer;
use App\Models\Instansi;
use App\Models\Pembayaran;
use App\Models\Keuangan;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardAdminController extends Controller
{
    public function index()
    {
        $currentYear = Carbon::now()->year;

        // =====================================================================
        // 1. TOTAL PENDAPATAN (GABUNGAN MANUAL + SISTEM)
        // =====================================================================

        // A. Pemasukan Sistem (Pembayaran Online)
        // Filter: created_at (tahun ini) AND status_pembayaran = 'berhasil'
        $pemasukanSistem = Pembayaran::whereYear('created_at', $currentYear)
            ->where('status_pembayaran', 'berhasil')
            ->sum('jumlah_bayar');

        // B. Pemasukan Manual (Tabel Keuangans)
        // Filter: tanggal_transaksi (tahun ini) AND tipe = 'pemasukan'
        $pemasukanManual = Keuangan::whereYear('tanggal_transaksi', $currentYear)
            ->where('tipe', 'pemasukan')
            ->sum('jumlah');

        // C. Total Gabungan
        $totalPendapatan = $pemasukanSistem + $pemasukanManual;

        // =====================================================================

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

        // 5. Distribusi Pembelian (DINAMIS - REAL DATA)
        $baseTxQuery = Pembayaran::whereYear('created_at', $currentYear)
            ->where('status_pembayaran', 'berhasil');

        $totalTx = $baseTxQuery->count();

        // Inisialisasi Data Distribusi
        $distribusiData = [
            'personal' => 0,
            'institution' => 0,
            'gift' => 0
        ];

        if ($totalTx > 0) {
            // A. Hitung Personal (Punya customer_id, tidak punya instansi_id)
            $countPersonal = (clone $baseTxQuery)->whereNotNull('customer_id')->whereNull('instansi_id')->count();

            // B. Hitung Instansi (Punya instansi_id)
            $countInstansi = (clone $baseTxQuery)->whereNotNull('instansi_id')->count();

            // C. Hitung Gift (Sementara 0)
            $countGift = 0;

            // Hitung Persentase
            $distribusiData['personal'] = round(($countPersonal / $totalTx) * 100);
            $distribusiData['institution'] = round(($countInstansi / $totalTx) * 100);
        }

        // Return ke View
        return Inertia::render('Admin/dashboard-admin', [
            'stats' => [
                'total_pendapatan' => $totalPendapatan, // Hasil Penjumlahan (A + B)
                'customer_aktif' => $customerAktif,
                'instansi_aktif' => $instansiAktif,
                'agenda' => $agendaMendatang,
                'distribusi' => $distribusiData
            ]
        ]);
    }
}