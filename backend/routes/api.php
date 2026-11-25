<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingController;

// --- ROUTE PUBLIK ---
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::get('/pages', [PageController::class, 'index']);
Route::get('/pages/{slug}', [PageController::class, 'show']);
Route::get('/portfolios', [PortfolioController::class, 'index']);
Route::get('/portfolios/{slug}', [PortfolioController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);

Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:10,1');

Route::get('/settings', [SettingController::class, 'index']);

// Admin settings update
Route::middleware('auth:sanctum')->put('/admin/settings', [SettingController::class, 'update']);

// --- ROUTE ADMIN (Wajib Token) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::get('/me', [AuthController::class, 'me']);

    // CRUD Pages
    Route::get('/admin/pages', [PageController::class, 'index']);
    Route::get('/admin/pages/{id}', [PageController::class, 'show']);
    Route::post('/admin/pages', [PageController::class, 'store']);
    Route::put('/admin/pages/{id}', [PageController::class, 'update']);
    Route::delete('/admin/pages/{id}', [PageController::class, 'destroy']);

    // CRUD Portfolios
    Route::get('/admin/portfolios', [PortfolioController::class, 'index']);
    Route::get('/admin/portfolios/{id}', [PortfolioController::class, 'show']);
    Route::post('/admin/portfolios', [PortfolioController::class, 'store']);
    Route::put('/admin/portfolios/{id}', [PortfolioController::class, 'update']);
    Route::delete('/admin/portfolios/{id}', [PortfolioController::class, 'destroy']);

    // CRUD Services
    Route::get('/admin/services', [ServiceController::class, 'index']);
    Route::get('/admin/services/{id}', [ServiceController::class, 'show']);
    Route::post('/admin/services', [ServiceController::class, 'store']);
    Route::put('/admin/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/admin/services/{id}', [ServiceController::class, 'destroy']);

    // Pesan kontak (alias contacts & contact-messages)
    Route::get('/admin/contacts', [ContactController::class, 'index']);
    Route::get('/admin/contact-messages', [ContactController::class, 'index']);
    Route::patch('/admin/contacts/{id}/read', [ContactController::class, 'markAsRead']);
    Route::patch('/admin/contact-messages/{id}/read', [ContactController::class, 'markAsRead']);
    Route::delete('/admin/contacts/{id}', [ContactController::class, 'destroy']);
    Route::delete('/admin/contact-messages/{id}', [ContactController::class, 'destroy']);
});
