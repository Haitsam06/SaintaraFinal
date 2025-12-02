<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('instansi', function (Blueprint $table) {
            // kode OTP verifikasi email
            if (!Schema::hasColumn('instansi', 'verification_code')) {
                $table->string('verification_code')->nullable()->after('status_akun');
            }

            if (!Schema::hasColumn('instansi', 'verification_code_expires_at')) {
                $table->timestamp('verification_code_expires_at')->nullable()->after('verification_code');
            }

            // penanda email sudah diverifikasi
            if (!Schema::hasColumn('instansi', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable()->after('verification_code_expires_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('instansi', function (Blueprint $table) {
            $table->dropColumn('verification_code');
            $table->dropColumn('verification_code_expires_at');
            $table->dropColumn('email_verified_at');
        });
    }
};
