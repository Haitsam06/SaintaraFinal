<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Import Middleware Custom
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

// Import Middleware Instansi Active (PENTING: Tambahkan ini)
use App\Http\Middleware\EnsureInstansiIsActive;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. KONFIGURASI MIDTRANS (BYPASS CSRF)
        // Agar Midtrans bisa mengirim webhook/callback ke aplikasi tanpa error 419.
        $middleware->validateCsrfTokens(except: [
            'payment/notification', // Sesuai dengan route POST callback kamu
        ]);

        // 2. KONFIGURASI COOKIE
        $middleware->encryptCookies(except: [
            'appearance', 
            'sidebar_state'
        ]);

        // 3. MIDDLEWARE GROUP: WEB
        // Middleware yang berjalan di setiap request web
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // 4. ALIAS MIDDLEWARE
        // Mendaftarkan nama singkat agar bisa dipakai di route/controller
        $middleware->alias([
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'auth.admin' => \App\Http\Middleware\AuthAdmin::class,
            
            // --- TAMBAHAN PENTING ---
            // Alias untuk middleware penjaga status aktif instansi
            'instansi.active' => EnsureInstansiIsActive::class, 
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();