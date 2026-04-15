<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Helpers\AuditHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Essayer Admin d'abord
        $user = Admin::where('email', $request->email)->first();
        $role = 'admin';

        // Si pas admin, essayer Staff
        if (!$user) {
            $user = \App\Models\Staff::where('email', $request->email)->first();
            $role = 'staff';
        }

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        AuditHelper::log('LOGIN', "Connexion de l'utilisateur ({$role}): {$user->email}");

        return response()->json([
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $role
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        AuditHelper::log('LOGOUT', "Déconnexion de l'administrateur: {$user->email}");
        $user->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }
}
