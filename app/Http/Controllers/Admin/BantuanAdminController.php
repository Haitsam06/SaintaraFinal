<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
// PERBAIKAN: Gunakan namespace yang sesuai dengan lokasi file model Anda (di folder Admin)
use App\Models\Admin\Bantuan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BantuanAdminController extends Controller
{
    public function index(Request $request)
    {
        // Query Dasar dengan Search
        $query = Bantuan::with(['customer', 'instansi'])
            ->when($request->search, function ($q, $search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($subQ) use ($search) {
                        $subQ->where('name', 'like', "%{$search}%");
                    });
            });

        // Hitung Statistik
        $stats = [
            'baru' => Bantuan::where('status', 'pending')->count(),
            'diproses' => Bantuan::where('status', 'diproses')->count(),
            'selesai' => Bantuan::where('status', 'selesai')->count(),
        ];

        // Ambil data (paginasi 10 per halaman)
        $tickets = $query->orderBy('created_at', 'desc')->paginate(10);

        // Ubah dari 'Admin/Support' menjadi 'Admin/Bantuan'
        return Inertia::render('Admin/Bantuan', [
            'tickets' => $tickets,
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'status' => 'required|in:pending,diproses,selesai',
        ]);

        // Karena admin yang buat, customer_id bisa null atau diisi logic lain
        Bantuan::create($validated);

        return redirect()->back()->with('message', 'Tiket berhasil dibuat');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'status' => 'required|in:pending,diproses,selesai',
        ]);

        $ticket = Bantuan::findOrFail($id);
        $ticket->update($validated);

        return redirect()->back()->with('message', 'Tiket berhasil diperbarui');
    }

    public function destroy($id)
    {
        $ticket = Bantuan::findOrFail($id);
        $ticket->delete();

        return redirect()->back()->with('message', 'Tiket berhasil dihapus');
    }
}