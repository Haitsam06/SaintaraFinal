<?php

namespace App\Http\Controllers;

use App\Models\Calendar; // Pastikan model Calendar sudah dibuat
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicCalendarController extends Controller
{
    public function index(Request $request)
    {
        // 1. Tentukan Bulan & Tahun (Default: Bulan ini)
        // Ambil tanggal dari parameter 'date' di URL (misal: ?date=2025-11-01)
        $date = $request->input('date') ? Carbon::parse($request->input('date')) : Carbon::now();
        $month = $date->month;
        $year = $date->year;

        // 2. Ambil semua agenda untuk bulan yang sedang dilihat
        $dbEvents = Calendar::whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->get();

        // 3. Format data agar sesuai dengan interface CalendarEvent di React
        $eventsData = $dbEvents->map(function ($item) {
            return [
                // Perhatikan format tanggal YYYY-MM-DD
                'id' => $item->id_kalender,
                'date' => Carbon::parse($item->tanggal)->format('Y-m-d'),
                'title' => $item->nama_agenda,
                'color' => $item->tipe, // Asumsi 'tipe' = color (blue/green/red)
                'icon' => null,
            ];
        });

        return Inertia::render('Calendar', [
            'events' => $eventsData,
            'currentDateStr' => $date->format('Y-m-d'), // Tanggal yang sedang dilihat
        ]);
    }
}