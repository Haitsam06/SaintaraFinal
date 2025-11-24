<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Admin\Token; // Pastikan namespace model benar sesuai struktur Anda
use App\Models\Paket;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class TokenAdminController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $ownership = $request->input('ownership'); // <--- 1. Ambil parameter filter

        $tokens = Token::query()
            ->with('customer')
            ->when($search, function ($query, $search) {
                $query->where('id_token', 'like', "%{$search}%");
            })
            // <--- 2. Logika Filter Kepemilikan
            ->when($ownership, function ($query, $ownership) {
                if ($ownership === 'free') {
                    $query->whereNull('customer_id'); // Filter yang belum punya pemilik
                } elseif ($ownership === 'owned') {
                    $query->whereNotNull('customer_id'); // Filter yang sudah punya pemilik
                }
            })
            ->latest('created_at')
            ->paginate(10)
            ->withQueryString();

        $pakets = Paket::all(['id_paket', 'nama_paket']);
        $customers = Customer::select('id_customer', 'nama_lengkap')->get();

        return Inertia::render('Admin/Token', [
            'tokens' => $tokens,
            'pakets' => $pakets,
            'customers' => $customers,
            'filters' => [
                'search' => $search,
                'ownership' => $ownership, // Kirim status filter kembali ke frontend
            ],
        ]);
    }

    public function store(Request $request)
    {
        // ... (Kode store Anda tetap sama, tidak perlu diubah) ...
        $request->validate([
            'paket_id' => 'required|exists:pakets,id_paket',
            'customer_id' => 'nullable|exists:customers,id_customer',
        ]);

        $idPaket = $request->paket_id;
        $tanggal = date('Ymd');
        $acak = strtoupper(Str::random(5));
        $generatedId = "{$idPaket}-{$tanggal}-{$acak}";

        $dummyPaymentId = 'MANUAL-ADMIN';

        $cekDummy = DB::table('pembayarans')->where('id_transaksi', $dummyPaymentId)->exists();

        if (!$cekDummy) {
            $firstCustomer = \App\Models\Customer::first();
            $firstPaket = \App\Models\Paket::first();

            if (!$firstCustomer || !$firstPaket) {
                return redirect()->back()->withErrors(['error' => 'Database Customer/Paket kosong.']);
            }

            DB::table('pembayarans')->insert([
                'id_transaksi' => $dummyPaymentId,
                'customer_id' => $firstCustomer->id_customer,
                'paket_id' => $firstPaket->id_paket,
                'status_pembayaran' => 'berhasil',
                'metode_pembayaran' => 'MANUAL',
                'waktu_dibuat' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Token::create([
            'id_token' => $generatedId,
            'pembayaran_id' => $dummyPaymentId,
            'customer_id' => $request->customer_id,
            'status' => 'belum digunakan',
            'tglBeli' => now(),
            'tglPemakaian' => null,
        ]);

        return redirect()->back()->with('success', 'Token berhasil dibuat.');
    }

    // <--- 3. Tambahkan Fungsi Update
    public function update(Request $request, $id)
    {
        $token = Token::findOrFail($id);

        $request->validate([
            'customer_id' => 'nullable|exists:customers,id_customer',
            'status' => 'required|in:digunakan,belum digunakan,kadaluarsa',
        ]);

        $token->update([
            'customer_id' => $request->customer_id,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Token berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Token::findOrFail($id)->delete();
        return redirect()->back();
    }
}