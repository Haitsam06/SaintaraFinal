<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tambah ke tabel customers
        Schema::table('customers', function (Blueprint $table) {
            if (!Schema::hasColumn('customers', 'reset_password_code')) {
                $table->string('reset_password_code')->nullable();
            }

            if (!Schema::hasColumn('customers', 'reset_password_expires_at')) {
                $table->timestamp('reset_password_expires_at')->nullable();
            }
        });

        // Tambah ke tabel instansi
        Schema::table('instansi', function (Blueprint $table) {
            if (!Schema::hasColumn('instansi', 'reset_password_code')) {
                $table->string('reset_password_code')->nullable();
            }

            if (!Schema::hasColumn('instansi', 'reset_password_expires_at')) {
                $table->timestamp('reset_password_expires_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('reset_password_code');
            $table->dropColumn('reset_password_expires_at');
        });

        Schema::table('instansi', function (Blueprint $table) {
            $table->dropColumn('reset_password_code');
            $table->dropColumn('reset_password_expires_at');
        });
    }
};
