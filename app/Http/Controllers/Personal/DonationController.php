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
    public function sendToken(Request $request)
    {
        // 1. Validasi Input (Tambah validasi paket_id)
        $request->validate([
            'email_penerima' => 'required|email|exists:customers,email',
            'nama_penerima'  => 'required|string',
            'paket_id'       => 'required|in:DSR,STD,PRM', // Pastikan hanya kode ini yang diterima
        ], [
            'email_penerima.exists' => 'Email penerima tidak terdaftar dalam sistem kami.',
            'paket_id.required'     => 'Anda harus memilih jenis paket token.',
        ]);

        // 2. Ambil Data Pengirim
        $pengirim = Auth::guard('customer')->user();

        if (!$pengirim) {
            return back()->withErrors(['message' => 'Sesi Anda tidak valid. Silakan login kembali.']);
        }
        
        $pengirimId = $pengirim->id_customer; 

        // 3. Cari Data Penerima
        $penerima = Customer::where('email', $request->email_penerima)->first();

        // Validasi: Tidak boleh kirim ke diri sendiri
        if ($pengirimId === $penerima->id_customer) {
            return back()->withErrors(['email_penerima' => 'Anda tidak bisa mendonasikan token ke akun sendiri.']);
        }

        // 4. Proses Transaksi
        try {
            DB::beginTransaction();

            // A. Cari SATU token milik pengirim YANG SESUAI PAKETNYA
            $token = Token::where('customer_id', $pengirimId)
                          ->where('paket_id', $request->paket_id) // <--- Filter Paket Ditambahkan
                          ->where('status', 'belum digunakan')
                          ->lockForUpdate()
                          ->first();

            // B. Cek ketersediaan token
            if (!$token) {
                // Biar pesan errornya enak dibaca user
                $namaPaket = match($request->paket_id) {
                    'DSR' => 'Dasar',
                    'STD' => 'Standar',
                    'PRM' => 'Premium',
                    default => 'tersebut'
                };
                
                return back()->withErrors(['message' => "Anda tidak memiliki stok Token Paket $namaPaket yang tersedia."]);
            }

            // C. Lakukan Transfer
            $token->customer_id = $penerima->id_customer;
            $token->save();

            DB::commit();

            return redirect()->back()->with('success', 'Berhasil mendonasikan 1 Token Paket '. $token->paket_id .' kepada ' . $penerima->nama_lengkap);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()]);
        }
    }
}