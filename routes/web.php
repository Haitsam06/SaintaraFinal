<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Personal\ProfilePersonalController;
use App\Http\Controllers\Admin\ProfileAdminController;
use App\Http\Controllers\Admin\AgendaAdminController;
use App\Http\Controllers\AuthController;

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

Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('auth/login');
    })->name('login');

    Route::post('/login', [AuthController::class, 'login'])->name('login.post');

    Route::get('/register', function () {
        return Inertia::render('auth/register');
    })->name('register');

    Route::post('/register', [AuthController::class, 'store'])->name('register.store');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


// --- GROUP PERSONAL USER (CUSTOMER) ---
// Middleware: auth:customer
Route::prefix('personal')->name('personal.')->group(function () {

    // URL: /personal/dashboardPersonal
    // Route Name: personal.dashboard
    // File: pages/Personal/dashboard-personal.tsx
    Route::get('/dashboardPersonal', function () {
        return Inertia::render('Personal/dashboard-personal');
    })->name('dashboard');

    Route::get('/profilePersonal', function () {
        return Inertia::render('Personal/Profile');
    })->name('profile');

    Route::get('/daftarTesPersonal', function () {
        return Inertia::render('Personal/daftar-tes');
    })->name('daftar-tes');

    Route::get('/transaksiTokenPersonal', function () {
        return Inertia::render('Personal/transaksi-token');
    })->name('transaksi-token');

    Route::get('/hasilTesPersonal', function () {
        return Inertia::render('Personal/results');
    })->name('results');

    Route::get('/hadiahDonasiPersonal', function () {
        return Inertia::render('Personal/hadiah-donasi');
    })->name('hadiah-donasi');

    Route::get('/bantuanPersonal', function () {
        return Inertia::render('Personal/bantuan');
    })->name('bantuan');

    Route::get('/settingPersonal', function () {
        return Inertia::render('Personal/setting');
    })->name('setting');

    Route::get('/formTes', function () {
        return Inertia::render('Personal/form-tes-personal');
    })->name('form-tes');

    Route::post('/update-profile-personal', [ProfilePersonalController::class, 'update']);

});

// --- GROUP ADMIN ---
// Middleware: auth:admin
Route::prefix('admin')->name('admin.')->group(function () {

    // URL: /admin/dashboardAdmin
    // Route Name: admin.dashboard (Fix: hapus prefix 'admin.' di name())
    // File: pages/Admin/dashboard-admin.tsx
    Route::get('/dashboardAdmin', function () {
        return Inertia::render('Admin/dashboard-admin');
    })->name('dashboard');

    Route::get('/profileAdmin', function () {
        return Inertia::render('Admin/Profile');
    })->name('profile');

    Route::post('/updateProfile', [ProfileAdminController::class, 'update'])->name('profile.update');

    Route::get('/agendaAdmin', [AgendaAdminController::class, 'index'])->name('agenda');

    Route::post('/agendaAdmin', [AgendaAdminController::class, 'store'])->name('agenda.store');

    Route::get('/penggunaAdmin', function () {
        return Inertia::render('Admin/Pengguna');
    })->name('pengguna');

    Route::get('/keuanganAdmin', function () {
        return Inertia::render('Admin/Keuangan');
    })->name('keuangan');

    Route::get('/teamAdmin', function () {
        return Inertia::render('Admin/Tim');
    })->name('team');

    Route::get('/supportAdmin', function () {
        return Inertia::render('Admin/Bantuan');
    })->name('support');

    Route::get('/settingsAdmin', function () {
        return Inertia::render('Admin/Pengaturan');
    })->name('settings');

});

// --- GROUP INSTANSI ---
// Middleware: auth:instansi
Route::prefix('instansi')->name('instansi.')->group(function () {

    // URL: /instansi/dashboardInstansi
    // Route Name: instansi.dashboard
    // File: pages/Instansi/Dashboard.tsx (Perhatikan huruf D besar sesuai screenshot)
    Route::get('/dashboardInstansi', function () {
        return Inertia::render('Instansi/Dashboard');
    })->name('dashboard');

    Route::get('/profilInstansi', function () {
        return Inertia::render('Instansi/Profile');
    })->name('profil');

    Route::get('/tesInstansi', function () {
        return Inertia::render('Instansi/DaftarTes');
    })->name('daftar_tes');

    Route::get('/transaksiInstansi', function () {
        return Inertia::render('Instansi/Transaksi');
    })->name('transaksi');

    Route::get('/hasilInstansi', function () {
        return Inertia::render('Instansi/Hasil');
    })->name('hasil');

    Route::get('/bantuanInstansi', function () {
        return Inertia::render('Instansi/Bantuan');
    })->name('bantuan');

    Route::get('/artikelInstansi', function () {
        return Inertia::render('Instansi/Artikel');
    })->name('artikel');

    Route::get('/pengaturanInstansi', function () {
        return Inertia::render('Instansi/Pengaturan');
    })->name('pengaturan');

    Route::get('/formTesInstansi', function () {
        return Inertia::render('Instansi/form-tes-instansi');
    })->name('form-tes-instansi');

});

require __DIR__ . '/settings.php';