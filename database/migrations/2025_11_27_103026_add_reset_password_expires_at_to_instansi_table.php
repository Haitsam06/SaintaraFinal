<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('instansi', function (Blueprint $table) {
            // Kolom ini SUDAH ada di sebagian DB karena migration sebelumnya.
            // Jadi kita cek dulu, hanya buat jika belum ada.
            if (! Schema::hasColumn('instansi', 'reset_password_expires_at')) {
                $table->timestamp('reset_password_expires_at')
                      ->nullable()
                      ->after('reset_password_code');
            }
        });
    }

    public function down(): void
    {
        Schema::table('instansi', function (Blueprint $table) {
            if (Schema::hasColumn('instansi', 'reset_password_expires_at')) {
                $table->dropColumn('reset_password_expires_at');
            }
        });
    }
};
