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
        DB::table('admins')->insert([
            [
                'id_admin' => 'ADM001',
                'role_id' => 1, // superadmin
                'nama_admin' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password123'),
                'no_telp' => '081234567890',
                'status_akun' => 'aktif',
                'foto' => null,
                'tanggal_dibuat' => Carbon::now()->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_admin' => 'ADM002',
                'role_id' => 1, // superadmin
                'nama_admin' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'no_telp' => '081234567891',
                'status_akun' => 'aktif',
                'foto' => null,
                'tanggal_dibuat' => Carbon::now()->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
