<?php

use Illuminate\Http\Request; // >>> DITAMBAHKAN
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\LandingController;

// --- IMPORT CONTROLLERS ---
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicCalendarController;

// [BARU] Import Universal Payment Callback
use App\Http\Controllers\PaymentCallbackController;

// controller verifikasi OTP
use App\Http\Controllers\VerifyOtpController;
// controller Reset Password
use App\Http\Controllers\PasswordResetController;

// 1. Personal Controllers
use App\Http\Controllers\Personal\ProfilePersonalController;
use App\Http\Controllers\Personal\TransaksiPersonalController;
use App\Http\Controllers\Personal\DaftarTesController;
use App\Http\Controllers\Personal\DonationController;
use App\Http\Controllers\Personal\BantuanController;
use App\Http\Controllers\Personal\SettingPersonalController;

// 2. Admin Controllers
use App\Http\Controllers\Admin\PenggunaAdminController;
use App\Http\Controllers\Admin\ProfileAdminController;
use App\Http\Controllers\Admin\AgendaAdminController;
use App\Http\Controllers\Admin\KeuanganAdminController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\Admin\SupportAdminController;
use App\Http\Controllers\Admin\TokenAdminController;
use App\Http\Controllers\Admin\ReviewAdminController;

// 3. Instansi Controllers
use App\Http\Controllers\Instansi\InstansiProfileController;
use App\Http\Controllers\Instansi\SettingInstansiController;
use App\Http\Controllers\Instansi\InstansiTesController;
use App\Http\Controllers\Instansi\BantuanInstansiController;
use App\Http\Controllers\Instansi\TransaksiInstansiController;
use App\Http\Controllers\Instansi\DashboardInstansiController; // <<< TAMBAHAN

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [LandingController::class, 'index'])->name('home');

// Route::get('/', function () {
//     return inertia('landing');
// })->name('home');

Route::get('/test-web', function () {
    return 'Web Loaded';
});

// >>> DITAMBAHKAN: ROUTE GLOBAL "dashboard"
// Route ini yang akan dipakai oleh Wayfinder untuk membuat fungsi dashboard()
Route::get('/dashboard', function (Request $request) {
    // Jika admin login
    if ($request->user('admin')) {
        return redirect()->route('admin.dashboard');
    }

    // Jika instansi login
    if ($request->user('instansi')) {
        return redirect()->route('instansi.dashboard');
    }

    // Jika customer (personal) login
    if ($request->user('customer')) {
        return redirect()->route('personal.dashboard');
    }

    // Jika belum login, arahkan ke login
    return redirect()->route('login');
})->name('dashboard');
// <<< END DITAMBAHKAN

// --- WEBHOOK MIDTRANS (UNIVERSAL) ---
Route::post('/payment/notification', [PaymentCallbackController::class, 'handle'])
    ->name('midtrans.notification');

// --- BAGIAN AUTHENTICATION (GUEST) ---
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

// LUPA PASSWORD
Route::get('/forgot-password', [PasswordResetController::class, 'requestForm'])
    ->name('password.request');

Route::post('/forgot-password', [PasswordResetController::class, 'sendCode'])
    ->name('password.email');   // dipakai email.form()

// <-- UBAH NAMA ROUTE INI, JANGAN 'password.reset' -->
Route::get('/reset-password', [PasswordResetController::class, 'showResetForm'])
    ->name('password.reset.form');

Route::post('/reset-password', [PasswordResetController::class, 'reset'])
    ->name('password.update');

// VERIFIKASI OTP
Route::get('/verify-otp', [VerifyOtpController::class, 'showForm'])->name('verify.form');
Route::post('/verify-otp', [VerifyOtpController::class, 'verify'])->name('verify.check');
Route::post('/resend-otp', [VerifyOtpController::class, 'resend'])->name('verify.resend');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// =========================================================================
// GROUP PERSONAL USER (CUSTOMER)
// Middleware: auth:customer
// =========================================================================
Route::middleware(['auth:customer'])->prefix('personal')->name('personal.')->group(function () {

    // --- DASHBOARD ---
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
// =========================================================================
Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {

    // 1. DASHBOARD
    Route::get('/dashboardAdmin', [DashboardAdminController::class, 'index'])->name('dashboard');

    // 2. PROFILE ADMIN
    Route::get('/profileAdmin', function () {
        return Inertia::render('Admin/Profile');
    })->name('profile');
    Route::patch('/updateProfile', [ProfileAdminController::class, 'update'])->name('profile.update');

    // 3. AGENDA
    Route::get('/agendaAdmin', [AgendaAdminController::class, 'index'])->name('agenda');
    Route::post('/agendaAdmin', [AgendaAdminController::class, 'store'])->name('agenda.store');

    // 4. MANAJEMEN PENGGUNA
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

    // 5. MANAJEMEN TOKEN
    Route::prefix('token')->name('token')->group(function () {
        Route::get('/', [TokenAdminController::class, 'index']); // name: admin.token
        Route::post('/', [TokenAdminController::class, 'store'])->name('.store');
        Route::put('/{id}', [TokenAdminController::class, 'update'])->name('.update');
        Route::delete('/{id}', [TokenAdminController::class, 'destroy'])->name('.destroy');
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

    Route::resource('reviews', ReviewAdminController::class)->except(['create', 'show', 'edit']);

    // 7. TIM & BANTUAN
    Route::get('/teamAdmin', function () {
        return Inertia::render('Admin/Tim');
    })->name('team');
    Route::get('/supportAdmin', [SupportAdminController::class, 'index'])->name('support');

    // 8. PENGATURAN SYSTEM
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

// =========================================================================
// GROUP INSTANSI
// Middleware: auth:instansi
// =========================================================================
Route::middleware(['auth:instansi'])->prefix('instansi')->name('instansi.')->group(function () {

    // --- DASHBOARD ---
    Route::get('/dashboardInstansi', [DashboardInstansiController::class, 'index'])
        ->name('dashboard');

    // --- PROFIL ---
    Route::get('/profilInstansi', [InstansiProfileController::class, 'edit'])->name('profil');
    Route::post('/profilInstansi', [InstansiProfileController::class, 'update'])->name('profil.update');

    // --- FITUR UTAMA ---
    Route::get('/tesInstansi', [InstansiTesController::class, 'index'])->name('daftar_tes');

    Route::get('/formTesInstansi', [InstansiTesController::class, 'form'])->name('form_tes');

    // Proses upload peserta (Excel + input manual)
    Route::post('/uploadPeserta', [InstansiTesController::class, 'uploadExcel'])->name('uploadPeserta');

    // Download template form peserta instansi
    Route::get('/downloadFormTemplate', [InstansiTesController::class, 'downloadFormTemplate'])->name('downloadFormTemplate');

    // Cek token sebelum submit
    Route::post('/checkTokenTesInstansi', [InstansiTesController::class, 'checkToken'])
        ->name('checkTokenTesInstansi');

    // --- TRANSAKSI & TOKEN INSTANSI ---
    Route::get('/transaksiInstansi', [TransaksiInstansiController::class, 'index'])->name('transaksi');
    Route::post('/transaksi/checkout', [TransaksiInstansiController::class, 'checkout'])->name('transaksi.checkout');

    // --- HASIL TES ---
    Route::get('/hasilInstansi', function () {
        return Inertia::render('Instansi/Hasil');
    })->name('hasil');

    Route::get('/bantuanInstansi', [BantuanInstansiController::class, 'index'])->name('bantuan');
    Route::post('/bantuanInstansi', [BantuanInstansiController::class, 'store'])->name('bantuan.store');

    Route::get('/artikelInstansi', function () {
        return Inertia::render('Instansi/Artikel');
    })->name('artikel');

    // --- PENGATURAN AKUN (SETTINGS) ---
    Route::get('/settingInstansi', [SettingInstansiController::class, 'index'])->name('Pengaturan.index');
    Route::put('/settingInstansi/password', [SettingInstansiController::class, 'updatePassword'])->name('Pengaturan.password');
    Route::delete('/settingInstansi', [SettingInstansiController::class, 'destroy'])->name('Pengaturan.destroy');
});

/*
|--------------------------------------------------------------------------
| ROUTE DOWNLOAD FILE PESERTA (TANPA AUTH)
|--------------------------------------------------------------------------
*/
Route::get(
    '/instansi/download-peserta/{filename}',
    [InstansiTesController::class, 'downloadPeserta']
)->name('instansi.downloadPeserta');

require __DIR__ . '/settings.php';
