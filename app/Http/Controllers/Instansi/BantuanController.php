<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BantuanController extends Controller
{
    public function index()
    {
        // render resources/js/pages/Instansi/Bantuan.tsx
        return Inertia::render('Instansi/Bantuan');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        SupportTicket::create([
            'user_id' => $request->user()->id,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status'  => 'open',
        ]);

        return redirect()->back()->with('success', 'Tiket bantuan berhasil dikirim.');
    }
}
