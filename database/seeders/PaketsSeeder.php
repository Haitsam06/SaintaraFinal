<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaketsSeeder extends Seeder
{
    public function run()
    {
        // Kosongkan tabel roles dulu agar tidak error duplicate entry jika di-seed ulang
        // DB::table('roles')->truncate(); // Opsional, hati-hati jika pakai foreign key constraint

        DB::table('pakets')->insert([
            [
                'id_paket' => 'DSR',
                'nama_paket' => 'Dasar',
                'harga' => 150000,
                'deskripsi' => 'Paket Dasar dengan fitur dasar',
                'jumlah_karakter' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_paket' => 'STD',
                'nama_paket' => 'Standar',
                'harga' => 375000,
                'deskripsi' => 'Paket Standar dengan fitur lebih lengkap',
                'jumlah_karakter' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_paket' => 'PRM',
                'nama_paket' => 'Premiun',
                'harga' => 450000,
                'deskripsi' => 'Paket Premium dengan fitur sangat lengkap',
                'jumlah_karakter' => 35,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}