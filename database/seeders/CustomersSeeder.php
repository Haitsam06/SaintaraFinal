<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class CustomersSeeder extends Seeder
{
    public function run()
    {
        DB::table('customers')->insert([
            [
                'id_customer' => 'CUST001',
                'role_id' => 3,
                'nama_lengkap' => 'Budi Santoso', 
                'email' => 'budi@gmail.com',
                'password' => Hash::make('password123'),
                'no_telp' => '081299887766',
                'alamat' => 'Jl. Mawar No. 10, Jakarta Selatan',
                'jenis_kelamin' => 'pria', 
                'status_akun' => 'aktif',
                'foto' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_customer' => 'CUST002',
                'role_id' => 3,
                'nama_lengkap' => 'Siti Aminah', 
                'email' => 'siti@gmail.com',
                'password' => Hash::make('password123'),
                'no_telp' => '085611223344',
                'alamat' => 'Jl. Melati No. 5, Bandung',
                'jenis_kelamin' => 'wanita', 
                'status_akun' => 'aktif',
                'foto' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}