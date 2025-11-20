<?php


use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;

Route::get('/', function () {
    return inertia('landing');
})->name('home');

Route::get('/test-web', function () {
    return 'Web Loaded';
});


Route::get('/login', function () {
    return Inertia::render('auth/login'); // Ubah 'Welcome' menjadi 'Home' (sesuai nama file Anda tanpa ekstensi)
})->name('login');

Route::get('/register', function () {
    return Inertia::render('auth/register'); // Ubah 'Welcome' menjadi 'Home' (sesuai nama file Anda tanpa ekstensi)
})->name('register');

Route::get('/calendar', function () {
    return Inertia::render('Calendar'); // Nama 'Calendar' harus sama persis dengan nama file Calendar.tsx
});

// Group untuk Personal User
Route::prefix('personal')->group(function () {

    // Dashboard Personal
    Route::get('/dashboardPersonal', function () {
        return Inertia::render('Personal/dashboard-personal');
    })->name('personal.dashboard');

    // Profil Personal
    Route::get('/profilePersonal', function () {
        return Inertia::render('Personal/Profile');
    })->name('personal.profile');

    // Daftar Tes Karakter
    Route::get('/daftarTesPersonal', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Profile.tsx
        return Inertia::render('Personal/daftar-tes');
    })->name('personal.daftar-tes');

    // Transaksi dan Token
    Route::get('/transaksiTokenPersonal', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Profile.tsx
        return Inertia::render('Personal/transaksi-token');
    })->name('personal.transaksi-token');

    // Transaksi dan Token
    Route::get('/hasilTesPersonal', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Profile.tsx
        return Inertia::render('Personal/results');
    })->name('personal.results');

    // Hadiah dan Donasi
    Route::get('/hadiahDonasiPersonal', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Profile.tsx
        return Inertia::render('Personal/hadiah-donasi');
    })->name('personal.hadiah-donasi');

    // Bantuan dan Layanan
    Route::get('/bantuanPersonal', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Profile.tsx
        return Inertia::render('Personal/bantuan');
    })->name('personal.bantuan');

    // Settings
    Route::get('/settingPersonal', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Profile.tsx
        return Inertia::render('Personal/setting');
    })->name('personal.setting');

    // Form Tes Karakter
    Route::get('/formTes', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Profile.tsx
        return Inertia::render('Personal/form-tes-personal');
    })->name('personal.form-tes');

});

// admin routes
Route::prefix('admin')->group(function () {

    // Dashboard admin
    Route::get('/dashboardAdmin', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Dashboard.tsx
        return Inertia::render('Admin/dashboard-admin');
    })->name('admin.dashboard');

    // Profil Personal
    Route::get('/profileAdmin', function () {
        // Pastikan file ada di: resources/js/Pages/Admin/Profile.tsx
        return Inertia::render('Admin/Profile');
    })->name('admin.profile');

    Route::get('/agendaAdmin', function () {
        // Pastikan file ada di: resources/js/Pages/Admin/Agenda.tsx
        return Inertia::render('Admin/Agenda');
    })->name('admin.agenda');

    Route::get('/penggunaAdmin', function () {
        // Pastikan file ada di: resources/js/Pages/Admin/Pengguna.tsx
        return Inertia::render('Admin/Pengguna');
    })->name('admin.pengguna');

    Route::get('/keuanganAdmin', function () {
        // Pastikan file ada di: resources/js/Pages/Admin/Keuangan.tsx
        return Inertia::render('Admin/Keuangan');
    })->name('admin.keuangan');

    Route::get('/teamAdmin', function () {
        // Pastikan file ada di: resources/js/Pages/Admin/Tim.tsx
        return Inertia::render('Admin/Tim');
    })->name('admin.team');

    Route::get('/supportAdmin', function () {
        // Pastikan file ada di: resources/js/Pages/Admin/Bantuan.tsx
        return Inertia::render('Admin/Bantuan');
    })->name('admin.support');

    Route::get('/settingsAdmin', function () {
        // Pastikan file ada di: resources/js/Pages/Admin/Pengaturan.tsx
        return Inertia::render('Admin/Pengaturan');
    })->name('admin.settings');

});


Route::prefix('instansi')->group(function () {

    // 1. Dashboard
    Route::get('/dashboardInstansi', function () {
        return Inertia::render('Instansi/Dashboard');
    })->name('instansi.dashboard');

    // 2. Profil Organisasi
    Route::get('/profilInstansi', function () {
        return Inertia::render('Instansi/Profile');
    })->name('instansi.profil');

    // 3. Daftar Tes Karakter
    Route::get('/tesInstansi', function () {
        return Inertia::render('Instansi/DaftarTes');
    })->name('instansi.daftar_tes');

    // 4. Transaksi & Voucher
    Route::get('/transaksiInstansi', function () {
        return Inertia::render('Instansi/Transaksi');
    })->name('instansi.transaksi');

    // 5. Hasil Tes
    Route::get('/hasilInstansi', function () {
        return Inertia::render('Instansi/Hasil');
    })->name('instansi.hasil');

    // 6. Bantuan
    Route::get('/bantuanInstansi', function () {
        return Inertia::render('Instansi/Bantuan');
    })->name('instansi.bantuan');

    // 7. Artikel Update
    Route::get('/artikelInstansi', function () {
        return Inertia::render('Instansi/Artikel');
    })->name('instansi.artikel');

    // 8. Pengaturan
    Route::get('/pengaturanInstansi', function () {
        return Inertia::render('Instansi/Pengaturan');
    })->name('instansi.pengaturan');

    Route::get('/formTesInstansi', function () {
        return Inertia::render('Instansi/form-tes-instansi');
    })->name('instansi.form-tes-instansi');

});

require __DIR__ . '/settings.php';
