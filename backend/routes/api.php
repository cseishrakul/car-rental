<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Driver Register
Route::post('/driver/register', [DriverController::class, 'driverRegister']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    // Manager CRUD
    Route::post('/managers', [UserController::class, 'storeManager']);
    Route::get('/managers', [UserController::class, 'indexManager']);
    Route::delete('/managers/{id}', [UserController::class, 'destroyManager']);

    // Car crud
    Route::get('/cars', [CarController::class, 'index']);
    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{car}', [CarController::class, 'update']);
    Route::delete('/cars/{car}', [CarController::class, 'destroy']);

    // Driver
    Route::get('/driver/pending', [DriverController::class, 'pending']);
    Route::post('/driver/{id}/approve', [DriverController::class, 'approve']);
    Route::post('/driver/{id}/reject', [DriverController::class, 'reject']);
    Route::get('/drivers',[DriverController::class,'index']);

    Route::get('driver/me',[DriverController::class,'me']);
    
    Route::post('/driver/{id}/pending', [DriverController::class, 'setPending']);
    Route::post('/driver/{id}/assign-car', [DriverController::class, 'assignCar']);

});
