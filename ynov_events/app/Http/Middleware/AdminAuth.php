<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-Admin-Token');

        if (!$token || $token !== env('ADMIN_TOKEN')) {
            return response()->json(['message' => 'Accès refusé. Token admin invalide.'], 403);
        }

        return $next($request);
    }
}
