<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Driver Register
Route::post('/driver/register', [DriverController::class, 'driverRegister']);
// User Register
Route::post('/social-login', [SocialAuthController::class, 'socialLogin']);

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail']);

// Frontend Api
Route::get('/cars-page', [CarController::class, 'carPage']);
Route::get('cars/featured', [CarController::class, 'featured']);
Route::get('/cars/{id}', [CarController::class, 'carDetails']);




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
    Route::get('/cars/{car}', [CarController::class, 'show']);
    Route::put('/cars/{car}', [CarController::class, 'update']);
    Route::delete('/cars/{car}', [CarController::class, 'destroy']);

    // Driver
    Route::get('/driver/pending', [DriverController::class, 'pending']);
    Route::post('/driver/{id}/approve', [DriverController::class, 'approve']);
    Route::post('/driver/{id}/reject', [DriverController::class, 'reject']);
    Route::get('/drivers', [DriverController::class, 'index']);

    Route::get('driver/me', [DriverController::class, 'me']);

    Route::post('/driver/{id}/pending', [DriverController::class, 'setPending']);
    Route::post('/driver/{id}/assign-car', [DriverController::class, 'assignCar']);


    // User Booking
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::post('/sslcommerz/initiate', [BookingController::class, 'initiateSSL']);


    // Admin & Manager Booking control
    Route::get('/admin/bookings', [BookingController::class, 'allBookings']);
    Route::get('/admin/bookings/{id}', [BookingController::class, 'show']);
    Route::patch('admin/bookings/{id}/confirm', [BookingController::class, 'confirmBooking']);
    Route::patch('admin/bookings/{id}/cancel', [BookingController::class, 'cancelBooking']);


    // User and Driver Bookings Page
    Route::get('/user/bookings', [BookingController::class, 'userBookings']);
    Route::get('/driver/bookings', [BookingController::class, 'driverBookings']);

    // Dynamic Routes
    Route::get('/monthly-bookings', [BookingController::class, 'monthlyBookings']);
    Route::get('/weekly-statistics', [BookingController::class, 'weeklyStatistics']);

    Route::get('/dashboard-metrics', [AuthController::class, 'metrics']);
});

// Notifications
Route::middleware('auth:sanctum')->get('/notifications', function (Request $request) {
    $user = $request->user();
    $notifications = $user->notifications()->latest()->get();
    return response()->json($notifications);
});
Route::middleware('auth:sanctum')->post('/notifications/read', function () {
    auth()->user()->unreadNotifications->markAsRead();
    return response()->json(['message' => 'Notifications marked as read']);
});


Route::post('/sslcommerz/success', [BookingController::class, 'success']);
Route::post('/sslcommerz/fail', [BookingController::class, 'fail']);
Route::post('/sslcommerz/cancel', [BookingController::class, 'cancel']);
