<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review; // Pastikan Model sudah di-import
use Carbon\Carbon;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data 1: Review dari Customer (Budi Santoso)
        // Pastikan ada data di tabel 'customers' dengan id 1
        Review::create([
            'id_review' => 1, // Kita isi manual karena di migration Anda bukan auto-increment standar
            'id_customer' => null,
            'id_admin' => 'ADM001',
            'id_instansi' => null, // Sesuai typo di migration Anda
            'content' => 'Saintara sangat membantu saya dalam mengenal diri saya lebih lanjut.',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Data 2: Review dari Admin
        // Pastikan ada data di tabel 'admins' dengan id 1
        Review::create([
            'id_review' => 2,
            'id_customer' => null,
            'id_admin' => 'ADM002',
            'id_instansi' => null,
            'content' => 'Sistem berjalan sangat lancar, fitur manajemen user sangat membantu admin.',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Data 3: Review dari Instansi
        // Pastikan ada data di tabel 'instansis' (atau nama tabel instansi Anda) dengan id 1
        Review::create([
            'id_review' => 3,
            'id_customer' => null,
            'id_admin' => 'ADM001',
            'id_instansi' => null,
            'content' => 'Platform ini memudahkan instansi kami dalam merekrut talenta baru.',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}