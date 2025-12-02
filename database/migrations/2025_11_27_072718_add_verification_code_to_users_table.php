<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Tambah kolom ke customers kalau tabelnya ada
        if (Schema::hasTable('customers')) {
            Schema::table('customers', function (Blueprint $table) {
                if (!Schema::hasColumn('customers', 'verification_code')) {
                    $table->string('verification_code')->nullable();
                }
                if (!Schema::hasColumn('customers', 'verification_code_expires_at')) {
                    $table->timestamp('verification_code_expires_at')->nullable();
                }
                if (!Schema::hasColumn('customers', 'email_verified_at')) {
                    $table->timestamp('email_verified_at')->nullable();
                }
            });
        }

        // Tambah kolom ke instansis kalau tabelnya ada
        if (Schema::hasTable('instansis')) { // kalau nama tabelmu beda (misal 'instansi'), ganti di sini
            Schema::table('instansis', function (Blueprint $table) {
                if (!Schema::hasColumn('instansis', 'verification_code')) {
                    $table->string('verification_code')->nullable();
                }
                if (!Schema::hasColumn('instansis', 'verification_code_expires_at')) {
                    $table->timestamp('verification_code_expires_at')->nullable();
                }
                if (!Schema::hasColumn('instansis', 'email_verified_at')) {
                    $table->timestamp('email_verified_at')->nullable();
                }
            });
        }

        // OPTIONAL: kalau admin juga mau pakai OTP
        if (Schema::hasTable('admins')) {
            Schema::table('admins', function (Blueprint $table) {
                if (!Schema::hasColumn('admins', 'verification_code')) {
                    $table->string('verification_code')->nullable();
                }
                if (!Schema::hasColumn('admins', 'verification_code_expires_at')) {
                    $table->timestamp('verification_code_expires_at')->nullable();
                }
                if (!Schema::hasColumn('admins', 'email_verified_at')) {
                    $table->timestamp('email_verified_at')->nullable();
                }
            });
        }
    }

    public function down()
    {
        if (Schema::hasTable('customers')) {
            Schema::table('customers', function (Blueprint $table) {
                if (Schema::hasColumn('customers', 'verification_code')) {
                    $table->dropColumn('verification_code');
                }
                if (Schema::hasColumn('customers', 'verification_code_expires_at')) {
                    $table->dropColumn('verification_code_expires_at');
                }
                if (Schema::hasColumn('customers', 'email_verified_at')) {
                    $table->dropColumn('email_verified_at');
                }
            });
        }

        if (Schema::hasTable('instansis')) { // lagi-lagi, sesuaikan kalau nama tabel beda
            Schema::table('instansis', function (Blueprint $table) {
                if (Schema::hasColumn('instansis', 'verification_code')) {
                    $table->dropColumn('verification_code');
                }
                if (Schema::hasColumn('instansis', 'verification_code_expires_at')) {
                    $table->dropColumn('verification_code_expires_at');
                }
                if (Schema::hasColumn('instansis', 'email_verified_at')) {
                    $table->dropColumn('email_verified_at');
                }
            });
        }

        if (Schema::hasTable('admins')) {
            Schema::table('admins', function (Blueprint $table) {
                if (Schema::hasColumn('admins', 'verification_code')) {
                    $table->dropColumn('verification_code');
                }
                if (Schema::hasColumn('admins', 'verification_code_expires_at')) {
                    $table->dropColumn('verification_code_expires_at');
                }
                if (Schema::hasColumn('admins', 'email_verified_at')) {
                    $table->dropColumn('email_verified_at');
                }
            });
        }
    }
};
