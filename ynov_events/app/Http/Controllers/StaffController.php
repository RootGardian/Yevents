<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Helpers\AuditHelper;

class StaffController extends Controller
{
    /**
     * Display a listing of the staff.
     */
    public function index()
    {
        return response()->json(Staff::orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created staff member.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:staffs,email',
            'password' => 'required|string|min:6',
        ]);

        $staff = Staff::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        AuditHelper::log('STAFF_CREATED', "Nouveau compte staff créé: {$staff->email}", $staff);

        return response()->json([
            'message' => 'Compte staff créé avec succès.',
            'staff' => $staff
        ], 201);
    }

    /**
     * Remove the specified staff member.
     */
    public function destroy($id)
    {
        $staff = Staff::findOrFail($id);
        $email = $staff->email;
        $staff->delete();

        AuditHelper::log('STAFF_DELETED', "Compte staff supprimé: {$email}");

        return response()->json(['message' => 'Compte staff supprimé.']);
    }
}
