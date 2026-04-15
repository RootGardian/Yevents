<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAuditToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $auditToken = $request->header('X-Audit-Token') ?? $request->query('audit_token');

        if (!$auditToken || $auditToken !== env('AUDIT_SECRET_TOKEN')) {
            return response()->json([
                'message' => 'Accès restreint : Token d\'audit invalide ou manquant.'
            ], 403);
        }

        return $next($request);
    }
}
