<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Calendar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class AgendaAdminController extends Controller
{
    public function index(Request $request)
    {
        // 1. Tentukan Bulan & Tahun (Default: Bulan ini)
        $date = $request->input('date') ? Carbon::parse($request->input('date')) : Carbon::now();

        $month = $date->month;
        $year = $date->year;

        // 2. Ambil Agenda untuk Kalender (Bulan ini saja)
        $eventsOfMonth = Calendar::whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->tanggal)->day, // Ambil tanggalnya saja (1-31)
                    'type' => $item->tipe, // blue, green, red
                ];
            });

        // 3. Ambil Agenda Terdekat (Hari ini ke depan, limit 5)
        $upcoming = Calendar::whereDate('tanggal', '>=', Carbon::now())
            ->orderBy('tanggal', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id_kalender,
                    'title' => $item->nama_agenda,
                    'date_string' => Carbon::parse($item->tanggal)->translatedFormat('d M Y'),
                    'time' => $item->waktu,
                    'type' => $item->tipe,
                ];
            });

        return Inertia::render('Admin/Agenda', [
            'currentDate' => $date->format('Y-m-d'), // Untuk state frontend
            'monthName' => $date->translatedFormat('F Y'),
            'events' => $eventsOfMonth,
            'upcoming' => $upcoming,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_agenda' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'waktu' => 'required|string|max:50',
            'tipe' => 'required|in:blue,green,red', // Warna dot
        ]);

        Calendar::create([
            'nama_agenda' => $request->nama_agenda,
            'tanggal' => $request->tanggal,
            'waktu' => $request->waktu,
            'deskripsi' => $request->deskripsi,
            'tipe' => $request->tipe,
            'admin_id' => Auth::guard('admin')->user()->id_admin,
        ]);

        return redirect()->back()->with('success', 'Agenda berhasil ditambahkan!');
    }
}