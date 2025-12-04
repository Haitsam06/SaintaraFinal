<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicCalendarController extends Controller
{
    public function index(Request $request)
    {
        // 1. Determine Month & Year (Default: Current Month)
        $date = $request->input('date') ? Carbon::parse($request->input('date')) : Carbon::now();
        $month = $date->month;
        $year = $date->year;

        // 2. Fetch all events for the current month
        $dbEvents = Calendar::whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->get();

        // 3. Format data to match React interface
        $eventsData = $dbEvents->map(function ($item) {
            return [
                'id' => $item->id_kalender,
                'date' => Carbon::parse($item->tanggal)->format('Y-m-d'),
                'title' => $item->nama_agenda,
                'color' => $item->tipe, 
                'icon' => null,
                // --- ADD THESE FIELDS ---
                'time' => $item->waktu,          // Map 'waktu' to 'time'
                'description' => $item->deskripsi // Map 'deskripsi' to 'description'
            ];
        });

        return Inertia::render('Calendar', [
            'events' => $eventsData,
            // 'upcoming' => [], // Keep if your interface requires it, otherwise remove from Props definition
            'currentDateStr' => $date->format('Y-m-d'), 
        ]);
    }
}