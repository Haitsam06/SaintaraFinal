<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaketsSeeder extends Seeder
{
    public function run()
    {
<<<<<<< HEAD
        DB::table('pakets')->delete();

        DB::table('pakets')->insert([
            [
                'id_paket' => 'PKT001',
=======
        // Kosongkan tabel roles dulu agar tidak error duplicate entry jika di-seed ulang
        // DB::table('roles')->truncate(); // Opsional, hati-hati jika pakai foreign key constraint

        DB::table('pakets')->insert([
            [
                'id_paket' => 'DSR',
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c
                'nama_paket' => 'Dasar',
                'harga' => 150000,
                'deskripsi' => 'Paket Dasar dengan fitur dasar',
                'jumlah_karakter' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
<<<<<<< HEAD
                'id_paket' => 'PKT002',
=======
                'id_paket' => 'STD',
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c
                'nama_paket' => 'Standar',
                'harga' => 375000,
                'deskripsi' => 'Paket Standar dengan fitur lebih lengkap',
                'jumlah_karakter' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
<<<<<<< HEAD
                'id_paket' => 'PKT003',
=======
                'id_paket' => 'PRM',
>>>>>>> 784db1578cd0acf150c33b172f12c267d77ba29c
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