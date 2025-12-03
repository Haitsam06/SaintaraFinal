<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Import Middleware Custom Kamu
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. KONFIGURASI MIDTRANS (PENTING)
        // Kita bypass CSRF agar Midtrans bisa mengirim notifikasi ke aplikasi kita
        $middleware->validateCsrfTokens(except: [
            'payment/notification', 
            // ATAU 'midtrans/callback' 
            // (Pastikan string di sini SAMA PERSIS dengan URL route POST yang kamu buat di routes/web.php)
        ]);

        // 2. KONFIGURASI COOKIE
        $middleware->encryptCookies(except: [
            'appearance', 
            'sidebar_state'
        ]);

        // 3. MIDDLEWARE GROUP: WEB
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // 4. ALIAS MIDDLEWARE
        $middleware->alias([
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'auth.admin' => \App\Http\Middleware\AuthAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();