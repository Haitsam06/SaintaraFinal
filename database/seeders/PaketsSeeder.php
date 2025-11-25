<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaketsSeeder extends Seeder
{
    public function run()
    {
        DB::table('pakets')->upsert([
            // ============================
            //  PAKET PERSONAL
            // ============================
            [
                'id_paket'        => 'DSR',
                'nama_paket'      => 'Dasar',
                'harga'           => 150000,
                'deskripsi'       => 'Paket Dasar dengan fitur dasar',
                'jumlah_karakter' => 10,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'id_paket'        => 'STD',
                'nama_paket'      => 'Standar',
                'harga'           => 375000,
                'deskripsi'       => 'Paket Standar dengan fitur lebih lengkap',
                'jumlah_karakter' => 20,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'id_paket'        => 'PRM',
                'nama_paket'      => 'Premiun',
                'harga'           => 450000,
                'deskripsi'       => 'Paket Premium dengan fitur sangat lengkap',
                'jumlah_karakter' => 35,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

            // ============================
            //  PAKET INSTANSI
            // ============================

            // 1. Daftar Akun Admin Untuk Tes Berulang – $2500
            [
                'id_paket'        => 'INST_ADMIN_REPEAT',
                'nama_paket'      => 'Akun Admin Tes Berulang',
                'harga'           => 37500000, // contoh: kira2 setara $2500
                'deskripsi'       => 'Daftar Akun Admin Instansi untuk tes berulang selama periode tertentu.',
                'jumlah_karakter' => 35,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

            // 2. Daftar Akun Admin Untuk satu kali Tes – $1500
            [
                'id_paket'        => 'INST_ADMIN_ONETIME',
                'nama_paket'      => 'Akun Admin Satu Kali Tes',
                'harga'           => 22500000, // contoh: kira2 setara $1500
                'deskripsi'       => 'Daftar Akun Admin Instansi untuk satu kali pelaksanaan tes.',
                'jumlah_karakter' => 35,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],

            // 3. Beli Kuota tes, $25/ Peserta
            [
                'id_paket'        => 'INST_QUOTA_25',
                'nama_paket'      => 'Beli Kuota Tes ($25/peserta)',
                'harga'           => 375000,   // contoh: setara $25 per peserta
                'deskripsi'       => 'Kuota tes karakter untuk peserta di instansi Anda, harga kurang lebih $25 per peserta.',
                'jumlah_karakter' => 20,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
        ],
        // unique key
        ['id_paket'],
        // kolom yang boleh di-update kalau sudah ada
        ['nama_paket', 'harga', 'deskripsi', 'jumlah_karakter', 'updated_at']);
    }
}
