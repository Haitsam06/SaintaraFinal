<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Bantuan;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SupportAdminController extends Controller
{
    public function index()
    {
        // Hitung statistik berdasarkan Status
        $stats = [
            'baru' => Bantuan::where('status', 'pending')->count(),
            'diproses' => Bantuan::where('status', 'diproses')->count(),
            'selesai' => Bantuan::where('status', 'selesai')->count(),
        ];

        // Ambil semua tiket urut dari yang terbaru
        $tickets = Bantuan::with('customer')
            ->latest()
            ->get();

        return Inertia::render('Admin/Bantuan', [
            'stats' => $stats,
            'tickets' => $tickets
        ]);
    }

    // Fungsi update status (opsional, untuk fitur ubah status nanti)
    public function update(Request $request, $id)
    {
        $ticket = Bantuan::findOrFail($id);
        $request->validate([
            'status' => 'required|in:pending,diproses,selesai'
        ]);
        $ticket->update(['status' => $request->status]);

        return redirect()->back();
    }
}