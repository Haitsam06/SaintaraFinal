<?php


use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;

Route::get('/', function () {
    return Inertia::render('landing'); // Ubah 'Welcome' menjadi 'Home' (sesuai nama file Anda tanpa ekstensi)
});

Route::get('/calendar', function () {
    return Inertia::render('Calendar'); // Nama 'Calendar' harus sama persis dengan nama file Calendar.tsx
});

// Group untuk Personal User
Route::prefix('personal')->group(function () {

    // Dashboard Personal
    Route::get('/dashboardPersonal', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Dashboard.tsx
        return Inertia::render('Personal/Dashboard');
    })->name('personal.dashboard');

    // Profil Personal
    Route::get('/profilePersonal', function () {
        // Pastikan file ada di: resources/js/Pages/Personal/Profile.tsx
        return Inertia::render('Personal/Profile');
    })->name('personal.profile');

});


require __DIR__ . '/settings.php';
