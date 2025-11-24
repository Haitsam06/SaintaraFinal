<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

// NAMA CLASS HARUS SAMA DENGAN NAMA FILE
class InstansisSeeder extends Seeder
{
    public function run()
    {
        DB::table('instansi')->delete();

        DB::table('instansi')->insert([
            [
                'id_instansi' => 'INS001',
                'role_id' => 4, // Asumsi 4 adalah role untuk Instansi
                'nama_instansi' => 'PT. Teknologi Maju Jaya',
                'email' => 'contact@majujaya.com',
                'password' => Hash::make('password123'),
                'no_telp' => '021-55667788',
                'alamat' => 'Gedung Cyber Lt. 5, Jakarta Pusat',
                'pic_name' => 'Pak Hartono', // Penanggung Jawab
                'bidang' => 'Teknologi Informasi',
                'status_akun' => 'aktif',
                'foto' => null,
                'tanggal_dibuat' => Carbon::now()->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_instansi' => 'INS002',
                'role_id' => 4,
                'nama_instansi' => 'SMA Negeri 1 Jakarta',
                'email' => 'info@sman1jkt.sch.id',
                'password' => Hash::make('password123'),
                'no_telp' => '021-11223344',
                'alamat' => 'Jl. Budi Utomo No. 7, Jakarta Pusat',
                'pic_name' => 'Ibu Kepala Sekolah',
                'bidang' => 'Pendidikan',
                'status_akun' => 'aktif',
                'foto' => null,
                'tanggal_dibuat' => Carbon::now()->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}