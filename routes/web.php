<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

use App\Http\Controllers\Admin\PenggunaAdminController;
use App\Http\Controllers\Admin\ProfileAdminController;
use App\Http\Controllers\Admin\AgendaAdminController;
use App\Http\Controllers\Admin\KeuanganAdminController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\Admin\SupportAdminController;
// --- IMPORT CONTROLLER BARU ---
use App\Http\Controllers\Personal\DonationController;
// ------------------------------
use App\Http\Controllers\Instansi\InstansiProfileController;
use App\Http\Controllers\Personal\ProfilePersonalController;
use App\Http\Controllers\Personal\TransaksiPersonalController;
use App\Http\Controllers\Personal\DaftarTesController;
use App\Http\Controllers\Personal\BantuanController;
use App\Http\Controllers\Personal\SettingPersonalController;
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

    // 1. DASHBOARD
    // File: dashboard-personal.tsx
    // URL: /personal/dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Personal/dashboard-personal');
    })->name('dashboard');

    // 2. PROFILE
    // File: Profile.tsx
    // URL: /personal/profile
    Route::get('/profile', function () {
        return Inertia::render('Personal/Profile');
    })->name('profile');

    // Update Profile (POST/PUT)
    // Menggunakan match agar bisa menerima POST (default form) atau PUT (jika ada spoofing)
    Route::match(['put', 'post'], '/profile', [ProfilePersonalController::class, 'update'])->name('profile.update');
    
    // 3. TES & HASIL
    // File: daftar-tes.tsx (List Tes)
    Route::get('/daftar-tes', [DaftarTesController::class, 'index'])->name('daftar-tes');

    // File: form-tes-personal.tsx (Halaman Mengerjakan Tes)
    Route::get('/ujian', function () {
        return Inertia::render('Personal/form-tes-personal');
    })->name('ujian.start');

    // File: results.tsx (Hasil Tes)
    Route::get('/hasil', function () {
        return Inertia::render('Personal/results');
    })->name('hasil');

    // 4. TRANSAKSI & TOKEN
    // File: transaksi-token.tsx (List Token & Paket)
    Route::get('/transaksi-token', [TransaksiPersonalController::class, 'index'])->name('transaksi-token');

    // File: buytoken.tsx (Halaman Checkout/Beli)
    Route::get('/beli-token', function () {
        return Inertia::render('Personal/buytoken');
    })->name('token.buy');

    // Proses Checkout (Backend)
    Route::post('/checkout', [TransaksiPersonalController::class, 'checkout'])->name('token.checkout');

    // File: transaction.tsx (Riwayat Transaksi)
    Route::get('/riwayat-transaksi', function () {
        return Inertia::render('Personal/transaction');
    })->name('transaksi.history');

    // 5. DONASI (GIFT)
    Route::prefix('donasi')->name('donasi.')->group(function () {
        // File: hadiah-donasi.tsx (Index/History Donasi)
        Route::get('/', function () {
            return Inertia::render('Personal/hadiah-donasi');
        })->name('index');

        // File: FormHadiahDonasi.tsx (Kirim ke Teman)
        Route::get('/kirim', function () {
            return Inertia::render('Personal/FormHadiahDonasi');
        })->name('kirim');
        Route::post('/kirim', [DonationController::class, 'sendToken'])->name('send');

        // File: FormHadiahDonasiSaintara.tsx (Kirim ke Saintara)
        Route::get('/saintara', function () {
            return Inertia::render('Personal/FormHadiahDonasiSaintara');
        })->name('saintara');
        Route::post('/saintara', [DonationController::class, 'sendToSaintara'])->name('send-saintara');
    });

    // 6. BANTUAN
    // File: bantuan.tsx
    Route::get('/bantuan', [BantuanController::class, 'index'])->name('bantuan');
    Route::post('/bantuan', [BantuanController::class, 'store'])->name('bantuan.store');

    // 7. PENGATURAN (SETTINGS)
    // File: setting.tsx
    Route::prefix('pengaturan')->name('setting.')->group(function () {
        Route::get('/', [SettingPersonalController::class, 'index'])->name('index');
        Route::put('/password', [SettingPersonalController::class, 'updatePassword'])->name('password');
        Route::delete('/destroy', [SettingPersonalController::class, 'destroy'])->name('destroy');
    });

});

// --- GROUP ADMIN ---
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