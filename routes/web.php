<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// --- IMPORT CONTROLLER BARU ---
use App\Http\Controllers\Personal\DonationController;
// ------------------------------
use App\Http\Controllers\Instansi\InstansiProfileController;
use App\Http\Controllers\Instansi\InstansiTesController;
use App\Http\Controllers\Instansi\DashboardInstansiController; // <--- TAMBAH INI
use App\Http\Controllers\Personal\ProfilePersonalController;
use App\Http\Controllers\Personal\TransaksiPersonalController;
use App\Http\Controllers\Personal\DaftarTesController;
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
// ... (BIARKAN SAMA seperti punyamu, tidak diubah) ...


/* ===========================
 *   GROUP INSTANSI
 * =========================== */
Route::middleware(['auth:instansi'])->prefix('instansi')->name('instansi.')->group(function () {

    // ==== DASHBOARD INSTANSI (PAKAI CONTROLLER) ====
    Route::get('/dashboardInstansi', [DashboardInstansiController::class, 'index'])
        ->name('dashboard');

    Route::get('/profilInstansi', [InstansiProfileController::class, 'edit'])
        ->name('profil');

    Route::post('/profilInstansi', [InstansiProfileController::class, 'update'])
        ->name('profil.update');

    /*
    |--------------------------------------------------------------------------
    | TES INSTANSI (pakai InstansiTesController)
    |--------------------------------------------------------------------------
    */

    // Halaman daftar paket tes instansi
    Route::get('/tesInstansi', [InstansiTesController::class, 'index'])
        ->name('tes');

    // Form input peserta (query ?paket_id=INST_...)
    Route::get('/formTesInstansi', [InstansiTesController::class, 'form'])
        ->name('formTesInstansi');

    // Proses upload Excel + input manual peserta
    Route::post('/uploadExcel', [InstansiTesController::class, 'uploadExcel'])
        ->name('uploadExcel');

    // ✅ ROUTE BARU: Download template form peserta untuk tombol "Unduh Form Tes"
    Route::get('/download-form-tes', [InstansiTesController::class, 'downloadFormTemplate'])
        ->name('tes.downloadForm');

    /*
    |--------------------------------------------------------------------------
    | ROUTE INSTANSI LAIN (tidak diubah)
    |--------------------------------------------------------------------------
    */

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
});

/*
|--------------------------------------------------------------------------
| ROUTE DOWNLOAD FILE PESERTA (TANPA AUTH)
|--------------------------------------------------------------------------
| Link ini yang dikirim ke WhatsApp, supaya bisa diakses dari HP admin
| tanpa harus login ke akun instansi.
*/
Route::get(
    '/instansi/download-peserta/{filename}',
    [InstansiTesController::class, 'downloadPeserta']
)->name('instansi.downloadPeserta');

require __DIR__ . '/settings.php';
