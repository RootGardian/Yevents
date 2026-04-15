<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Admin;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !($request->user() instanceof Admin)) {
            return response()->json([
                'message' => 'Accès refusé : Cette action nécessite des droits d\'administrateur.'
            ], 403);
        }

        return $next($request);
    }
}
