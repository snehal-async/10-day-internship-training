<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\InspectionController;
use App\Http\Middleware\AuthenticateApi;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Day 08: Facility & Employee Management System REST API Routes
|--------------------------------------------------------------------------
|
| Public Endpoints: Read-only access to directory listings and authentication.
| Protected Endpoints: Create, update, and delete mutations requiring Bearer token.
|
*/

// --- Health Check ---
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'framework' => 'Laravel ' . app()->version(),
        'database' => config('database.default'),
        'timestamp' => now()->toIso8601String(),
    ]);
});

// --- Public Authentication Routes ---
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// --- Public Read-Only Resource Endpoints ---
Route::prefix('facilities')->group(function () {
    Route::get('/', [FacilityController::class, 'index']);
    Route::get('/{id}', [FacilityController::class, 'show']);
});

Route::prefix('inspections')->group(function () {
    Route::get('/', [InspectionController::class, 'index']);
    Route::get('/{id}', [InspectionController::class, 'show']);
});

Route::prefix('complaints')->group(function () {
    Route::get('/', [ComplaintController::class, 'index']);
    Route::get('/{id}', [ComplaintController::class, 'show']);
});

// --- Protected Endpoints (Require Bearer Token) ---
Route::middleware(AuthenticateApi::class)->group(function () {
    // Authenticated User Profile & Logout
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Facility Mutations
    Route::prefix('facilities')->group(function () {
        Route::post('/', [FacilityController::class, 'store']);
        Route::match(['put', 'patch'], '/{id}', [FacilityController::class, 'update']);
        Route::delete('/{id}', [FacilityController::class, 'destroy']);
    });

    // Inspection Mutations
    Route::prefix('inspections')->group(function () {
        Route::post('/', [InspectionController::class, 'store']);
        Route::match(['put', 'patch'], '/{id}', [InspectionController::class, 'update']);
        Route::delete('/{id}', [InspectionController::class, 'destroy']);
    });

    // Complaint Mutations
    Route::prefix('complaints')->group(function () {
        Route::post('/', [ComplaintController::class, 'store']);
        Route::match(['put', 'patch'], '/{id}', [ComplaintController::class, 'update']);
        Route::delete('/{id}', [ComplaintController::class, 'destroy']);
    });
});
