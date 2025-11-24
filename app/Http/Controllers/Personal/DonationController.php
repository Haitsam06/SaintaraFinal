<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    // --- FUNGSI 1: Kirim ke Teman (User to User) ---
    public function sendToken(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'email_penerima' => 'required|email|exists:customers,email',
            'nama_penerima'  => 'required|string',
            'paket_id'       => 'required|in:DSR,STD,PRM',
        ], [
            'email_penerima.exists' => 'Email penerima tidak terdaftar.',
            'paket_id.required'     => 'Anda harus memilih jenis paket token.',
        ]);

        // 2. Ambil Pengirim
        $pengirim = Auth::guard('customer')->user();
        if (!$pengirim) return back()->withErrors(['message' => 'Sesi invalid.']);
        
        $pengirimId = $pengirim->id_customer; 

        // 3. Cek Penerima
        $penerima = Customer::where('email', $request->email_penerima)->first();
        if ($pengirimId === $penerima->id_customer) {
            return back()->withErrors(['email_penerima' => 'Tidak bisa kirim ke diri sendiri.']);
        }

        // 4. Proses Transfer
        try {
            DB::beginTransaction();

            $token = Token::where('customer_id', $pengirimId)
                          ->where('paket_id', $request->paket_id)
                          ->where('status', 'belum digunakan')
                          ->lockForUpdate()
                          ->first();

            if (!$token) {
                return back()->withErrors(['message' => "Stok Token paket {$request->paket_id} Anda habis."]);
            }

            // Pindah kepemilikan ke ID Teman
            $token->customer_id = $penerima->id_customer;
            $token->save();

            DB::commit();
            return redirect()->back()->with('success', 'Token berhasil dikirim ke ' . $penerima->nama_lengkap);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Error: ' . $e->getMessage()]);
        }
    }

    // --- FUNGSI 2: Donasi ke Saintara (User to System/Null) ---
    public function sendToSaintara(Request $request)
    {
        // 1. Validasi (Hanya butuh Paket ID)
        $request->validate([
            'paket_id' => 'required|in:DSR,STD,PRM',
        ], [
            'paket_id.required' => 'Pilih paket token yang ingin didonasikan.',
        ]);

        // 2. Ambil Pengirim
        $pengirim = Auth::guard('customer')->user();
        if (!$pengirim) return back()->withErrors(['message' => 'Sesi invalid.']);

        // 3. Proses Transfer
        try {
            DB::beginTransaction();

            // Cari Token milik user
            $token = Token::where('customer_id', $pengirim->id_customer)
                          ->where('paket_id', $request->paket_id)
                          ->where('status', 'belum digunakan')
                          ->lockForUpdate()
                          ->first();

            if (!$token) {
                 // Biar pesan errornya enak dibaca user
                 $namaPaket = match($request->paket_id) {
                    'DSR' => 'Dasar',
                    'STD' => 'Standar',
                    'PRM' => 'Premium',
                    default => 'tersebut'
                };
                return back()->withErrors(['message' => "Anda tidak memiliki stok Token Paket $namaPaket untuk didonasikan ke Saintara."]);
            }

            // KUNCI LOGIKA: Set customer_id jadi NULL (Kembali ke sistem/admin)
            $token->customer_id = null;
            $token->save();

            DB::commit();
            return redirect()->back()->with('success', 'Terima kasih! Token berhasil didonasikan kembali ke Saintara.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Error: ' . $e->getMessage()]);
        }
    }
}