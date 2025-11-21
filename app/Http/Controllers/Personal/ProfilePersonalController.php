<?php

namespace App\Http\Controllers\Personal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;

class ProfilePersonalController extends Controller
{
    //
    public function index() {
        return Inertia::render('Personal/Profile');
    }

    public function update(Request $request) {
        $validated = $request->validate([
            'id_customer' => 'required|exists:customers,id_customer',
            'nama_lengkap' => 'nullable|string',
            'nama_panggilan' => 'nullable|string',
            'email' => 'nullable|email',
            'no_telp' => 'nullable|string',
            'negara' => 'nullable|string',
            'kota' => 'nullable|string',
            'jenis_kelamin' => 'nullable|string',
            'gol_darah' => 'nullable|string',
            'foto' => 'nullable|string',
            'status_akun' => 'nullable|string',
        ]);



        $cust = Customer::where('id_customer', $request->id_customer)->first();
        $cust->update($validated);
        return response()->json([
            'message' => 'Profile berhasil diperbarui!',
            'data' => $cust,
        ]);


    }
}
