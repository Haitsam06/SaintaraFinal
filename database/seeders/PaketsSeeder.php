<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaketsSeeder extends Seeder
{
    public function run()
    {
        DB::table('pakets')->delete();

        DB::table('pakets')->insert([
            [
                'id_paket' => 'PKT001',
                'nama_paket' => 'Dasar',
                'harga' => 150000,
                'deskripsi' => 'Paket Dasar dengan fitur dasar',
                'jumlah_karakter' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_paket' => 'PKT002',
                'nama_paket' => 'Standar',
                'harga' => 375000,
                'deskripsi' => 'Paket Standar dengan fitur lebih lengkap',
                'jumlah_karakter' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_paket' => 'PKT003',
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