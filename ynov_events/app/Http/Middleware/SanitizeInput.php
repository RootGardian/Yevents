<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$value, $key) {
            if (is_string($value) && !in_array($key, ['password', 'current_password', 'password_confirmation'])) {
                $value = strip_tags(trim($value));
            }
        });

        $request->merge($input);

        return $next($request);
    }
}
