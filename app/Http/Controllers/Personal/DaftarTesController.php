<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Paket;
use App\Models\Token;

class DaftarTesController extends Controller
{
    public function index()
    {
        $user = Auth::guard('customer')->user();

        // Ambil semua paket dan inject status kepemilikan token
        $daftarPaket = Paket::all()->map(function ($paket) use ($user) {
            
            // LOGIC UTAMA: Cek apakah ada token milik user untuk paket ini yang belum dipakai
            $hasToken = Token::where('customer_id', $user->id_customer)
                             ->where('paket_id', $paket->id_paket)
                             ->where('status', 'belum digunakan')
                             ->exists(); // Mengembalikan true/false

            return [
                'id_paket' => $paket->id_paket,
                'nama_paket' => $paket->nama_paket,
                'harga' => (int) $paket->harga,
                'deskripsi' => $paket->deskripsi,
                'jumlah_karakter' => $paket->jumlah_karakter,
                'has_token' => $hasToken, // <--- Ini yang akan dibaca React
            ];
        });

        return Inertia::render('Personal/daftar-tes', [
            'daftar_paket' => $daftarPaket
        ]);
    }
}