<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    public function run()
    {
        DB::table('roles')->delete();

        DB::table('roles')->insert([
            [
                'id' => 1,
                'role_user' => 'superadmin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'role_user' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'role_user' => 'customer',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // --- INI YANG WAJIB DITAMBAHKAN ---
            [
                'id' => 4,
                'role_user' => 'instansi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}