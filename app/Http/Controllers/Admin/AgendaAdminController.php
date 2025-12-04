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
    /**
     * Menampilkan halaman Agenda & Kalender.
     */
    public function index(Request $request)
    {
        // 1. Tentukan Bulan & Tahun (Default: Bulan ini)
        $date = $request->input('date') ? Carbon::parse($request->input('date')) : Carbon::now();
        $month = $date->month;
        $year = $date->year;

        // 2. Ambil Data untuk "Dots" Kalender (Hanya butuh tanggal & warna)
        $eventsOfMonth = Calendar::whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->tanggal)->day, // Ambil tanggalnya saja (1-31)
                    'type' => $item->tipe, // blue, green, red
                ];
            });

        // 3. Ambil Data Lengkap untuk List di Kanan (CRUD Edit/Delete butuh ini)
        // Kita ambil data bulan yang sedang dipilih, bukan hanya 'upcoming'
        $listAgenda = Calendar::whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->orderBy('tanggal', 'asc')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id_kalender,
                    'title' => $item->nama_agenda,
                    'time' => $item->waktu,
                    'type' => $item->tipe,
                    'date_string' => Carbon::parse($item->tanggal)->translatedFormat('d F Y'), // Tampilan text
    
                    // --- FIELD PENTING UNTUK MODAL EDIT ---
                    'date_raw' => Carbon::parse($item->tanggal)->format('Y-m-d'), // Format input date HTML
                    'deskripsi' => $item->deskripsi,
                    // --------------------------------------
                ];
            });

        return Inertia::render('Admin/Agenda', [ // Pastikan path ini sesuai struktur folder Anda
            'currentDate' => $date->format('Y-m-d'),
            'monthName' => $date->translatedFormat('F Y'),
            'events' => $eventsOfMonth,
            'upcoming' => $listAgenda, // Frontend menggunakan prop 'upcoming'
        ]);
    }

    /**
     * Simpan Agenda Baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_agenda' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'waktu' => 'required|string|max:50',
            'tipe' => 'required|in:blue,green,red',
            'deskripsi' => 'nullable|string',
        ]);

        Calendar::create([
            'nama_agenda' => $validated['nama_agenda'],
            'tanggal' => $validated['tanggal'],
            'waktu' => $validated['waktu'],
            'deskripsi' => $validated['deskripsi'],
            'tipe' => $validated['tipe'],
            'admin_id' => Auth::guard('admin')->user()->id_admin,
        ]);

        return redirect()->back()->with('message', 'Agenda berhasil ditambahkan!');
    }

    /**
     * Update Agenda (Edit).
     */
    public function update(Request $request, $id)
    {
        // Cari data berdasarkan ID
        $calendar = Calendar::findOrFail($id);

        $validated = $request->validate([
            'nama_agenda' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'waktu' => 'required|string|max:50',
            'tipe' => 'required|in:blue,green,red',
            'deskripsi' => 'nullable|string',
        ]);

        $calendar->update([
            'nama_agenda' => $validated['nama_agenda'],
            'tanggal' => $validated['tanggal'],
            'waktu' => $validated['waktu'],
            'deskripsi' => $validated['deskripsi'],
            'tipe' => $validated['tipe'],
        ]);

        return redirect()->back()->with('message', 'Agenda berhasil diperbarui!');
    }

    /**
     * Hapus Agenda.
     */
    public function destroy($id)
    {
        $calendar = Calendar::findOrFail($id);
        $calendar->delete();

        return redirect()->back()->with('message', 'Agenda berhasil dihapus!');
    }
}