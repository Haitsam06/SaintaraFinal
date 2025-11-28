<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use App\Models\Bantuan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BantuanController extends Controller
{
    // Menampilkan Halaman
    public function index()
    {
        return Inertia::render('Personal/bantuan');
    }

    // Menyimpan Data Laporan
    public function store(Request $request)
    {
        $request->validate([
            'subject'     => 'required|string|max:255',
            'category'    => 'required|string',
            'description' => 'required|string',
        ]);

        $user = Auth::guard('customer')->user();

        Bantuan::create([
            'instansi_id' => null,
            'customer_id' => $user ? $user->id_customer : null,
            'subject'     => $request->subject,
            'category'    => $request->category,
            'description' => $request->description,
            'status'      => 'pending'
        ]);

        return redirect()->back()->with('success', 'Laporan Anda berhasil dikirim. Tim kami akan segera menghubungi Anda.');
    }
}