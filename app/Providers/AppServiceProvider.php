<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <- TAMBAHKAN BARIS INI

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Paksa semua URL (route, asset, dll) pakai HTTPS di non-local env
        if (config('app.env') !== 'local') {
            URL::forceScheme('https');
        }
    }
}
