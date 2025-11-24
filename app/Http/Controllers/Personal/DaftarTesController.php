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

            // LOGIC PERBAIKAN:
            // Karena tidak ada kolom 'paket_id' di tabel tokens,
            // Kita cek apakah 'id_token' DIMULAI dengan id_paket (contoh: PKT001-...)

            $hasToken = Token::where('customer_id', $user->id_customer)
                ->where('id_token', 'like', $paket->id_paket . '-%') // <--- PERBAIKAN DISINI
                ->where('status', 'belum digunakan')
                ->exists();

            return [
                'id_paket' => $paket->id_paket,
                'nama_paket' => $paket->nama_paket,
                'harga' => (int) $paket->harga,
                'deskripsi' => $paket->deskripsi,
                'jumlah_karakter' => $paket->jumlah_karakter,
                'has_token' => $hasToken,
            ];
        });

        return Inertia::render('Personal/daftar-tes', [
            'daftar_paket' => $daftarPaket
        ]);
    }
}