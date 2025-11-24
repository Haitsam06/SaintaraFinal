<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
// --- IMPORT CONTROLLER BARU ---
use App\Http\Controllers\Personal\DonationController; 
// ------------------------------
use App\Http\Controllers\Instansi\InstansiProfileController;
use App\Http\Controllers\Personal\ProfilePersonalController;
use App\Http\Controllers\Personal\TransaksiPersonalController;
use App\Http\Controllers\Personal\DaftarTesController;
use App\Http\Controllers\Personal\BantuanController;
use App\Http\Controllers\Personal\SettingPersonalController;
use App\Http\Controllers\Admin\ProfileAdminController;
use App\Http\Controllers\Admin\AgendaAdminController;
use App\Http\Controllers\PublicCalendarController;
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

    Route::get('/kalender-agenda', [PublicCalendarController::class, 'index'])->name('public.calendar');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


// --- GROUP PERSONAL USER (CUSTOMER) ---
// Middleware: auth:customer
Route::middleware(['auth:customer'])->prefix('personal')->name('personal.')->group(function () {

    // URL: /personal/dashboardPersonal
    Route::get('/dashboardPersonal', function () {
        return Inertia::render('Personal/dashboard-personal');
    })->name('dashboard');

    Route::get('/profilePersonal', function () {
        return Inertia::render('Personal/Profile');
    })->name('profile');

    Route::put('/profile/update', [ProfilePersonalController::class, 'update'])->name('personal.profile.update');

    Route::get('/daftarTesPersonal', [DaftarTesController::class, 'index'])->name('daftar-tes');

    Route::get('/transaksiTokenPersonal', [TransaksiPersonalController::class, 'index'])
    ->name('transaksi-token');

    // Route untuk checkout transaksi token
    Route::post('/transaksi/checkout', [TransaksiPersonalController::class, 'checkout'])->name('transaksi.checkout');

    Route::get('/hasilTesPersonal', function () {
        return Inertia::render('Personal/results');
    })->name('results');

    // --- FITUR DONASI ---
    
    // 1. Halaman History/List Donasi
    Route::get('/hadiahDonasiPersonal', function () {
        return Inertia::render('Personal/hadiah-donasi');
    })->name('hadiah-donasi');

    // 2. Halaman Form Donasi (Tampilan React tadi)
    Route::get('/FormHadiahDonasi', function () {
        return Inertia::render('Personal/FormHadiahDonasi');
    })->name('form-hadiah-donasi');

    // 3. PROSES BACKEND KIRIM DONASI (Baru Ditambahkan)
    // URL Akhir: /personal/donation/send
    Route::post('/donation/send', [DonationController::class, 'sendToken'])->name('donation.send');

    // Route Tampilan Form Donasi ke Saintara
    Route::get('/FormHadiahDonasiSaintara', function () {
        return Inertia::render('Personal/FormHadiahDonasiSaintara');
    })->name('form-hadiah-donasi-saintara');

    // Route PROSES Donasi ke Saintara (Backend)
    Route::post('/donation/saintara', [DonationController::class, 'sendToSaintara'])->name('donation.saintara');

    Route::get('/bantuanPersonal', [BantuanController::class, 'index'])->name('bantuan');
    Route::post('/bantuanPersonal', [BantuanController::class, 'store'])->name('bantuan.store');
    
    // --------------------

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

    // Route Halaman Pengaturan
    Route::get('/settingPersonal', [SettingPersonalController::class, 'index'])
        ->name('setting.index');

    // Route Update Password (PUT)
    Route::put('/settingPersonal/password', [SettingPersonalController::class, 'updatePassword'])
        ->name('setting.password');

    // Route Hapus Akun (DELETE) - Gunakan URL yang sama dengan index tapi method DELETE
    Route::delete('/settingPersonal', [SettingPersonalController::class, 'destroy'])
        ->name('setting.destroy');

});

// --- GROUP ADMIN ---
// Middleware: auth:admin
Route::prefix('admin')->name('admin.')->group(function () {

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
Route::middleware(['auth:instansi'])->prefix('instansi')->name('instansi.')->group(function () {

    Route::get('/dashboardInstansi', function () {
        return Inertia::render('Instansi/Dashboard');
    })->name('dashboard');

    Route::get('/profilInstansi', [InstansiProfileController::class, 'edit'])
        ->name('profil');

    Route::post('/profilInstansi', [InstansiProfileController::class, 'update'])
        ->name('profil.update');

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