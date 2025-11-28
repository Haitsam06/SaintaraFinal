<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\BantuanInstansi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BantuanInstansiController extends Controller
{
    public function index()
    {
        // render resources/js/pages/Instansi/Bantuan.tsx
        return Inertia::render('Instansi/Bantuan');
    }

    // Menyimpan Data Laporan
    public function store(Request $request)
    {
        $request->validate([
            'subject'     => 'required|string|max:255',
            'category'    => 'required|string',
            'description' => 'required|string',
        ]);

        $user = Auth::guard('instansi')->user();

        BantuanInstansi::create([
            'instansi_id' => $user ? $user->id_instansi : null,
            'customer_id' => null,
            'subject'     => $request->subject,
            'category'    => $request->category,
            'description' => $request->description,
            'status'      => 'pending'
        ]);

        return redirect()->back()->with('success', 'Laporan Anda berhasil dikirim. Tim kami akan segera menghubungi Anda.');
    }

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'subject' => ['required', 'string', 'max:255'],
    //         'message' => ['required', 'string'],
    //     ]);

    //     $user = Auth::guard('instansi')->user();

    //     SupportTicket::create([
    //         'user_id' => $request->user()->id,
    //         'subject' => $validated['subject'],
    //         'message' => $validated['message'],
    //         'status'  => 'open',
    //     ]);

    //     return redirect()->back()->with('success', 'Tiket bantuan berhasil dikirim.');
    // }
}
