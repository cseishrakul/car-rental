<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function (){
    Route::get('/me',[AuthController::class,'me']);
    Route::post('logout',[AuthController::class,'logout']);

    // Manager CRUD
    Route::post('/managers',[UserController::class,'storeManager']);
    Route::get('/managers',[UserController::class,'indexManager']);
    Route::delete('/managers/{id}',[UserController::class,'destroyManager']);

});
