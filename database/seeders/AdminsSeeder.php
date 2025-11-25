<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminsSeeder extends Seeder
{
    public function run()
    {
        DB::table('admins')->delete();

        DB::table('admins')->insert([
            [
                'id_admin' => 'ADM001', // Karena tipe datanya string
                'role_id' => 1,         // Pastikan ID 1 ada di tabel roles, atau ganti null
                'nama_admin' => 'Super Administrator',
                'jenis_kelamin' => 'Pria', // Data untuk kolom baru
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password123'), // Enkripsi password
                'no_telp' => '081299998888',
                'status_akun' => 'aktif',
                'foto' => null,
                'tanggal_dibuat' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id_admin' => 'ADM002',
                'role_id' => 1,      // Contoh jika tanpa role
                'nama_admin' => 'Siti Admin',
                'jenis_kelamin' => 'Wanita', // Data untuk kolom baru
                'email' => 'siti@example.com',
                'password' => Hash::make('password123'),
                'no_telp' => '085712345678',
                'status_akun' => 'aktif',
                'foto' => null,
                'tanggal_dibuat' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id_admin' => 'ADM003',
                'role_id' => 2,      // Contoh jika tanpa role
                'nama_admin' => 'Yanti Trihasti',
                'jenis_kelamin' => 'Wanita', // Data untuk kolom baru
                'email' => 'yanti@example.com',
                'password' => Hash::make('password123'),
                'no_telp' => '085712345678',
                'status_akun' => 'aktif',
                'foto' => null,
                'tanggal_dibuat' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
