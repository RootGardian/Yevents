<?php

use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [ParticipantController::class, 'store'])->middleware('throttle:6,1');
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (Admin & Staff)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin/participants', [ParticipantController::class, 'index']);
    Route::post('/admin/checkin/{token}', [ParticipantController::class, 'checkIn']);
    Route::get('/admin/stats', [ParticipantController::class, 'stats']); // Les stats sont visibles par tous si besoin ? Non, l'user a dit de les retirer pour le staff.

    // Exclusive Admin routes
    Route::middleware('is_admin')->group(function () {
        Route::get('/admin/export', [ParticipantController::class, 'export']);
        Route::post('/admin/resend-email', [ParticipantController::class, 'resend']);
        Route::get('/admin/audit-logs', [\App\Http\Controllers\AuditController::class, 'index']);
        
        // Staff Management
        Route::get('/admin/staff', [\App\Http\Controllers\StaffController::class, 'index']);
        Route::post('/admin/staff', [\App\Http\Controllers\StaffController::class, 'store']);
        Route::delete('/admin/staff/{id}', [\App\Http\Controllers\StaffController::class, 'destroy']);
    });
});

// Route publique pour scan direct (résultat visuel)
Route::get('/admin/checkin/{token}', [ParticipantController::class, 'checkIn']);
