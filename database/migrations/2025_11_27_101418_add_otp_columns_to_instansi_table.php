<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('instansi', function (Blueprint $table) {
            // Kode OTP verifikasi email
            if (!Schema::hasColumn('instansi', 'verification_code')) {
                $table->string('verification_code')->nullable()->after('status_akun');
            }

            if (!Schema::hasColumn('instansi', 'verification_code_expires_at')) {
                $table->timestamp('verification_code_expires_at')->nullable()->after('verification_code');
            }

            // Penanda email sudah diverifikasi
            if (!Schema::hasColumn('instansi', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable()->after('verification_code_expires_at');
            }

            // PERHATIAN:
            // Kolom reset_password_code & reset_password_expires_at
            // SUDAH dibuat oleh migration 2025_11_27_084757_...
            // Jadi TIDAK perlu ditambah lagi di sini.
        });
    }

    public function down(): void
    {
        Schema::table('instansi', function (Blueprint $table) {
            // Saat rollback, hapus kolom OTP/verifikasi saja
            if (Schema::hasColumn('instansi', 'verification_code')) {
                $table->dropColumn('verification_code');
            }

            if (Schema::hasColumn('instansi', 'verification_code_expires_at')) {
                $table->dropColumn('verification_code_expires_at');
            }

            if (Schema::hasColumn('instansi', 'email_verified_at')) {
                $table->dropColumn('email_verified_at');
            }
        });
    }
};
