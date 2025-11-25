<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- IMPORT CONTROLLERS ---
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicCalendarController;

// Personal Controllers
use App\Http\Controllers\Personal\ProfilePersonalController;
use App\Http\Controllers\Personal\TransaksiPersonalController;
use App\Http\Controllers\Personal\DaftarTesController;
use App\Http\Controllers\Personal\DonationController;
use App\Http\Controllers\Personal\BantuanController;
use App\Http\Controllers\Personal\SettingPersonalController;
// use App\Http\Controllers\Perso

// Admin Controllers
use App\Http\Controllers\Admin\PenggunaAdminController;
use App\Http\Controllers\Admin\ProfileAdminController;
use App\Http\Controllers\Admin\AgendaAdminController;
use App\Http\Controllers\Admin\KeuanganAdminController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\Admin\SupportAdminController;

// Instansi Controllers
use App\Http\Controllers\Instansi\InstansiProfileController;


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

// --- WEBHOOK MIDTRANS (PENTING) ---
// URL ini HARUS sama dengan yang ada di bootstrap/app.php (validateCsrfTokens)
// Dan pastikan settingan di Dashboard Midtrans (Notification URL) mengarah ke: domain.com/payment/notification
Route::post('/payment/notification', [TransaksiPersonalController::class, 'callback']);


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


// =========================================================================
// GROUP PERSONAL USER (CUSTOMER)
// Middleware: auth:customer
// =========================================================================
Route::middleware(['auth:customer'])->prefix('personal')->name('personal.')->group(function () {

    // --- DASHBOARD (LOAD DATA DARI DB) ---
    Route::get('/dashboardPersonal', function () {
        return Inertia::render('Personal/dashboard-personal');
    })->name('dashboard');

    // --- PROFIL ---
    Route::get('/profilePersonal', function () {
        return Inertia::render('Personal/Profile');
    })->name('profile');
    Route::put('/profile/update', [ProfilePersonalController::class, 'update'])->name('profile.update');
    Route::post('/update-profile-personal', [ProfilePersonalController::class, 'update']); 

    // --- DAFTAR TES ---
    Route::get('/daftarTesPersonal', [DaftarTesController::class, 'index'])->name('daftar-tes');
    Route::get('/formTes', function () {
        return Inertia::render('Personal/form-tes-personal');
    })->name('ujian.start');

    // --- TRANSAKSI & TOKEN ---
    Route::get('/transaksiTokenPersonal', [TransaksiPersonalController::class, 'index'])->name('transaksi-token');
    Route::post('/transaksi/checkout', [TransaksiPersonalController::class, 'checkout'])->name('transaksi.checkout');

    // --- HASIL TES ---
    Route::get('/hasilTesPersonal', function () {
        return Inertia::render('Personal/results');
    })->name('results');

    // --- HADIAH & DONASI ---
    Route::get('/hadiahDonasiPersonal', function () {
        return Inertia::render('Personal/hadiah-donasi');
    })->name('hadiah-donasi');

    Route::get('/FormHadiahDonasi', function () {
        return Inertia::render('Personal/FormHadiahDonasi');
    })->name('form-hadiah-donasi');
    Route::post('/donation/send', [DonationController::class, 'sendToken'])->name('donation.send');

    Route::get('/FormHadiahDonasiSaintara', function () {
        return Inertia::render('Personal/FormHadiahDonasiSaintara');
    })->name('form-hadiah-donasi-saintara');
    Route::post('/donation/saintara', [DonationController::class, 'sendToSaintara'])->name('donation.saintara');

    // --- BANTUAN & LAYANAN ---
    Route::get('/bantuanPersonal', [BantuanController::class, 'index'])->name('bantuan');
    Route::post('/bantuanPersonal', [BantuanController::class, 'store'])->name('bantuan.store');

    // --- PENGATURAN AKUN ---
    Route::get('/settingPersonal', [SettingPersonalController::class, 'index'])->name('setting.index');
    Route::put('/settingPersonal/password', [SettingPersonalController::class, 'updatePassword'])->name('setting.password');
    Route::delete('/settingPersonal', [SettingPersonalController::class, 'destroy'])->name('setting.destroy');

});


// =========================================================================
// GROUP ADMIN
// Middleware: auth:admin
// --- GROUP ADMIN ---
// Middleware: auth:admin (Wajib Login sebagai Admin)
Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {

    // 1. DASHBOARD
    // Menggunakan Controller (Disarankan)
    Route::get('/dashboardAdmin', [DashboardAdminController::class, 'index'])->name('dashboard');

    // Opsi Alternatif (Jika Controller belum siap, uncomment baris bawah dan comment baris atas):
    // Route::get('/dashboardAdmin', function () { return Inertia::render('Admin/dashboard-admin'); })->name('dashboard');

    // 2. PROFILE ADMIN
    Route::get('/profileAdmin', function () {
        return Inertia::render('Admin/Profile');
    })->name('profile');

    // Update Profile (PATCH)
    Route::patch('/updateProfile', [ProfileAdminController::class, 'update'])->name('profile.update');

    // 3. AGENDA
    Route::get('/agendaAdmin', [AgendaAdminController::class, 'index'])->name('agenda');
    Route::post('/agendaAdmin', [AgendaAdminController::class, 'store'])->name('agenda.store');

    // 4. MANAJEMEN PENGGUNA (Personal & Instansi)
    Route::prefix('pengguna')->name('pengguna.')->group(function () {
        // Halaman Index
        Route::get('/personal', [PenggunaAdminController::class, 'indexPersonal'])->name('personal');
        Route::get('/instansi', [PenggunaAdminController::class, 'indexInstansi'])->name('instansi');

        // Redirect default /pengguna ke /pengguna/personal
        Route::get('/', function () {
            return redirect()->route('admin.pengguna.personal');
        });

        // CRUD Pengguna
        Route::post('/', [PenggunaAdminController::class, 'store'])->name('store');
        Route::put('/{id}', [PenggunaAdminController::class, 'update'])->name('update');
        Route::delete('/{id}', [PenggunaAdminController::class, 'destroy'])->name('destroy');
    });

    // 5. MANAJEMEN TOKEN
    Route::prefix('token')->name('token')->group(function () { // Grouping agar lebih rapi
        Route::get('/', [App\Http\Controllers\Admin\TokenAdminController::class, 'index']); // name: admin.token
        Route::post('/', [App\Http\Controllers\Admin\TokenAdminController::class, 'store'])->name('.store');
        Route::put('/{id}', [App\Http\Controllers\Admin\TokenAdminController::class, 'update'])->name('.update');
        Route::delete('/{id}', [App\Http\Controllers\Admin\TokenAdminController::class, 'destroy'])->name('.destroy');
    });

    // 6. KEUANGAN
    Route::prefix('keuangan')->name('keuangan.')->group(function () {
        Route::get('/pemasukan', [KeuanganAdminController::class, 'indexPemasukan'])->name('pemasukan');
        Route::get('/pengeluaran', [KeuanganAdminController::class, 'indexPengeluaran'])->name('pengeluaran');
        Route::get('/laporan', [KeuanganAdminController::class, 'indexLaporan'])->name('laporan');
        Route::get('/laporan/cetak', [KeuanganAdminController::class, 'printLaporan'])->name('laporan.print');
        Route::get('/gaji', [KeuanganAdminController::class, 'indexGaji'])->name('gaji');

        Route::post('/store', [KeuanganAdminController::class, 'store'])->name('store');
        Route::post('/gaji', [KeuanganAdminController::class, 'storeGaji'])->name('gaji.store');

        Route::put('/update/{id}', [KeuanganAdminController::class, 'update'])->name('update');
        Route::put('/gaji/{id}', [KeuanganAdminController::class, 'updateGaji'])->name('gaji.update');

        Route::delete('/gaji/{id}', [KeuanganAdminController::class, 'destroyGaji'])->name('gaji.destroy');
        Route::delete('/destroy/{id}', [KeuanganAdminController::class, 'destroy'])->name('destroy');

        Route::get('/', function () {
            return redirect()->route('admin.keuangan.pemasukan');
        });
    });

    // 7. TIM & BANTUAN (Menu Samping)
    Route::get('/teamAdmin', function () {
        return Inertia::render('Admin/Tim');
    })->name('team');

    Route::get('/supportAdmin', [SupportAdminController::class, 'index'])->name('support');

    // 8. PENGATURAN SYSTEM
    Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
        // Halaman Utama Pengaturan
        Route::get('/', [PengaturanController::class, 'index'])->name('index');

        // Tab Umum
        Route::get('/umum', [PengaturanController::class, 'umum'])->name('umum');
        Route::put('/umum', [PengaturanController::class, 'updateUmum'])->name('umum.update');

        // Tab Tim (CRUD Tim di Pengaturan)
        Route::get('/tim', [PengaturanController::class, 'indexTim'])->name('tim');
        Route::post('/tim', [PengaturanController::class, 'storeTim'])->name('tim.store');
        Route::put('/tim/{id}', [PengaturanController::class, 'updateTim'])->name('tim.update');
        Route::delete('/tim/{id}', [PengaturanController::class, 'destroyTim'])->name('tim.destroy');

        // Tab Paket (CRUD Paket)
        Route::get('/paket', [PengaturanController::class, 'indexPaket'])->name('paket');
        Route::post('/paket', [PengaturanController::class, 'storePaket'])->name('paket.store');
        Route::put('/paket/{id}', [PengaturanController::class, 'updatePaket'])->name('paket.update');
        Route::delete('/paket/{id}', [PengaturanController::class, 'destroyPaket'])->name('paket.destroy');
    });

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