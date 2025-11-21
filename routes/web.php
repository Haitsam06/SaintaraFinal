<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

// --- IMPORT CONTROLLER BARU DISINI ---
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController; // Pastikan nama controller sesuai dengan file Anda

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return inertia('landing');
})->name('home');

Route::get('/test-web', function () {
    return 'Web Loaded';
});

// --- BAGIAN AUTHENTICATION ---

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');

// 1. Route untuk Menampilkan Halaman Register (GET)
Route::get('/register', function () {
    return Inertia::render('auth/register');
})->name('register');

// 2. Route untuk Memproses Data Register (POST) - [INI YANG DITAMBAHKAN]
// Pastikan method di AuthController namanya 'store' sesuai kode sebelumnya
Route::post('/register', [AuthController::class, 'store'])->name('register.store');


Route::get('/calendar', function () {
    return Inertia::render('Calendar');
});

// --- GROUP PERSONAL USER ---
Route::prefix('personal')->group(function () {

    Route::get('/dashboardPersonal', function () {
        return Inertia::render('Personal/dashboard-personal');
    })->name('personal.dashboard');

    Route::get('/profilePersonal', function () {
        return Inertia::render('Personal/Profile');
    })->name('personal.profile');

    Route::get('/daftarTesPersonal', function () {
        return Inertia::render('Personal/daftar-tes');
    })->name('personal.daftar-tes');

    Route::get('/transaksiTokenPersonal', function () {
        return Inertia::render('Personal/transaksi-token');
    })->name('personal.transaksi-token');

    Route::get('/hasilTesPersonal', function () {
        return Inertia::render('Personal/results');
    })->name('personal.results');

    Route::get('/hadiahDonasiPersonal', function () {
        return Inertia::render('Personal/hadiah-donasi');
    })->name('personal.hadiah-donasi');

    Route::get('/bantuanPersonal', function () {
        return Inertia::render('Personal/bantuan');
    })->name('personal.bantuan');

    Route::get('/settingPersonal', function () {
        return Inertia::render('Personal/setting');
    })->name('personal.setting');

    Route::get('/formTes', function () {
        return Inertia::render('Personal/form-tes-personal');
    })->name('personal.form-tes');

});

// --- GROUP ADMIN ---
Route::prefix('admin')->group(function () {

    Route::get('/dashboardAdmin', function () {
        return Inertia::render('Admin/dashboard-admin');
    })->name('admin.dashboard');

    Route::get('/profileAdmin', function () {
        return Inertia::render('Admin/Profile');
    })->name('admin.profile');

    Route::get('/agendaAdmin', function () {
        return Inertia::render('Admin/Agenda');
    })->name('admin.agenda');

    Route::get('/penggunaAdmin', function () {
        return Inertia::render('Admin/Pengguna');
    })->name('admin.pengguna');

    Route::get('/keuanganAdmin', function () {
        return Inertia::render('Admin/Keuangan');
    })->name('admin.keuangan');

    Route::get('/teamAdmin', function () {
        return Inertia::render('Admin/Tim');
    })->name('admin.team');

    Route::get('/supportAdmin', function () {
        return Inertia::render('Admin/Bantuan');
    })->name('admin.support');

    Route::get('/settingsAdmin', function () {
        return Inertia::render('Admin/Pengaturan');
    })->name('admin.settings');

});

// --- GROUP INSTANSI ---
Route::prefix('instansi')->group(function () {

    Route::get('/dashboardInstansi', function () {
        return Inertia::render('Instansi/dashboard');
    })->name('instansi.dashboard');

    Route::get('/profilInstansi', function () {
        return Inertia::render('Instansi/Profile');
    })->name('instansi.profil');

    Route::get('/tesInstansi', function () {
        return Inertia::render('Instansi/DaftarTes');
    })->name('instansi.daftar_tes');

    Route::get('/transaksiInstansi', function () {
        return Inertia::render('Instansi/Transaksi');
    })->name('instansi.transaksi');

    Route::get('/hasilInstansi', function () {
        return Inertia::render('Instansi/Hasil');
    })->name('instansi.hasil');

    Route::get('/bantuanInstansi', function () {
        return Inertia::render('Instansi/Bantuan');
    })->name('instansi.bantuan');

    Route::get('/artikelInstansi', function () {
        return Inertia::render('Instansi/Artikel');
    })->name('instansi.artikel');

    Route::get('/pengaturanInstansi', function () {
        return Inertia::render('Instansi/Pengaturan');
    })->name('instansi.pengaturan');

    Route::get('/formTesInstansi', function () {
        return Inertia::render('Instansi/form-tes-instansi');
    })->name('instansi.form-tes-instansi');

});

require __DIR__ . '/settings.php';