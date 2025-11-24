<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

use App\Http\Controllers\Admin\PenggunaAdminController;
use App\Http\Controllers\Admin\ProfileAdminController;
use App\Http\Controllers\Admin\AgendaAdminController;
use App\Http\Controllers\Admin\KeuanganAdminController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicCalendarController;
use App\Http\Controllers\Personal\ProfilePersonalController;

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
Route::prefix('personal')->name('personal.')->group(function () {

    Route::get('/dashboardPersonal', function () {
        return Inertia::render('Personal/dashboard-personal');
    })->name('dashboard');

    Route::get('/profilePersonal', function () {
        return Inertia::render('Personal/Profile');
    })->name('profile');

    Route::put('/profile/update', [ProfilePersonalController::class, 'update'])->name('personal.profile.update');

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

    // ============================================================
    //  PERUBAHAN DISINI: Menggunakan Controller, bukan function()
    // ============================================================
    Route::get('/dashboardAdmin', [DashboardAdminController::class, 'index'])->name('dashboard');


    // Profile
    Route::get('/profileAdmin', function () {
        return Inertia::render('Admin/Profile');
    })->name('profile');

    // FIX: Menggunakan Patch tanpa double prefix.
    Route::patch('/updateProfile', [ProfileAdminController::class, 'update'])->name('profile.update');

    // Agenda
    Route::get('/agendaAdmin', [AgendaAdminController::class, 'index'])->name('agenda');
    Route::post('/agendaAdmin', [AgendaAdminController::class, 'store'])->name('agenda.store');

    // ============================================================
    //  PERBAIKAN ROUTE PENGGUNA (CRUD & TAB)
    // ============================================================
    Route::prefix('pengguna')->name('pengguna.')->group(function () {
        Route::get('/personal', [PenggunaAdminController::class, 'indexPersonal'])->name('personal');
        Route::get('/instansi', [PenggunaAdminController::class, 'indexInstansi'])->name('instansi');

        Route::get('/', function () {
            return redirect()->route('admin.pengguna.personal');
        });

        Route::post('/', [PenggunaAdminController::class, 'store'])->name('store');
        Route::put('/{id}', [PenggunaAdminController::class, 'update'])->name('update');
        Route::delete('/{id}', [PenggunaAdminController::class, 'destroy'])->name('destroy');
    });

    // Token Management
    Route::get('/token', [App\Http\Controllers\Admin\TokenAdminController::class, 'index'])->name('token');

    // --- TAMBAHKAN BARIS INI ---
    Route::post('/token', [App\Http\Controllers\Admin\TokenAdminController::class, 'store'])->name('token.store');
    Route::put('/token/{id}', [App\Http\Controllers\Admin\TokenAdminController::class, 'update'])->name('token.update');
    Route::delete('/token/{id}', [App\Http\Controllers\Admin\TokenAdminController::class, 'destroy'])->name('token.destroy');
    // Menu Keuangan
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

    Route::get('/teamAdmin', function () {
        return Inertia::render('Admin/Tim');
    })->name('team');

    Route::get('/supportAdmin', function () {
        return Inertia::render('Admin/Bantuan');
    })->name('support');

    Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
        Route::get('/', [PengaturanController::class, 'index'])->name('index');

        Route::get('/umum', [PengaturanController::class, 'umum'])->name('umum');
        Route::put('/umum', [PengaturanController::class, 'updateUmum'])->name('umum.update');

        Route::get('/tim', [PengaturanController::class, 'indexTim'])->name('tim');
        Route::post('/tim', [PengaturanController::class, 'storeTim'])->name('tim.store');
        Route::put('/tim/{id}', [PengaturanController::class, 'updateTim'])->name('tim.update');
        Route::delete('/tim/{id}', [PengaturanController::class, 'destroyTim'])->name('tim.destroy');

        Route::get('/paket', [PengaturanController::class, 'indexPaket'])->name('paket');
        Route::post('/paket', [PengaturanController::class, 'storePaket'])->name('paket.store');
        Route::put('/paket/{id}', [PengaturanController::class, 'updatePaket'])->name('paket.update');
        Route::delete('/paket/{id}', [PengaturanController::class, 'destroyPaket'])->name('paket.destroy');
    });

});

// --- GROUP INSTANSI ---
// Middleware: auth:instansi
Route::prefix('instansi')->name('instansi.')->group(function () {
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