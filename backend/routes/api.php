<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ContactController;

// --- ROUTE PUBLIK ---
Route::post('/login', [AuthController::class, 'login']);
Route::get('/pages', [PageController::class, 'index']);
Route::get('/pages/{slug}', [PageController::class, 'show']);
Route::get('/portfolios', [PortfolioController::class, 'index']);
Route::get('/portfolios/{slug}', [PortfolioController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);

// --- ROUTE ADMIN (Wajib Token) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // CRUD Pages
    Route::post('/admin/pages', [PageController::class, 'store']);
    Route::put('/admin/pages/{id}', [PageController::class, 'update']);
    Route::delete('/admin/pages/{id}', [PageController::class, 'destroy']);

    // CRUD Portfolios
    Route::post('/admin/portfolios', [PortfolioController::class, 'store']);
    Route::put('/admin/portfolios/{id}', [PortfolioController::class, 'update']);
    Route::delete('/admin/portfolios/{id}', [PortfolioController::class, 'destroy']);

    // CRUD Services
    Route::post('/admin/services', [ServiceController::class, 'store']);
    Route::put('/admin/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/admin/services/{id}', [ServiceController::class, 'destroy']);
    
    // Route Admin untuk lihat pesan kontak
    Route::get('/admin/contacts', [ContactController::class, 'index']);
});