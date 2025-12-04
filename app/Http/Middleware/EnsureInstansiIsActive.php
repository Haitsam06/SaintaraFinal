<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureInstansiIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek apakah user login sebagai instansi
        if (Auth::guard('instansi')->check()) {
            
            // 2. Ambil data user
            $user = Auth::guard('instansi')->user();

            // 3. Jika status belum aktif, PAKSA ke halaman aktivasi
            // Kita kecualikan route 'instansi.activation' supaya tidak looping redirect
            if ($user->status_akun !== 'aktif' && !$request->routeIs('instansi.activation')) {
                return redirect()->route('instansi.activation');
            }
        }

        return $next($request);
    }
}