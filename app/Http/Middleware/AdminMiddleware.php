<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth('sanctum')->check()) {
            return redirect('/login');
        }

        // Check if user has admin role (role_id = 1 or 2)
        $user = auth('sanctum')->user();
        if ($user && in_array($user->role_id, [1, 2])) {
            return $next($request);
        }

        return redirect('/')->with('error', 'Unauthorized access');
    }
}
