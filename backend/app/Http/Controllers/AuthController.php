<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function me(Request $request){
        return response()->json([$request->user()]);
    }

    // We'll make its frontend later -- 20/09/25
    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'in:user,manager,driver',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user'
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['user' => $user,'token' => $token]);

    }

    public function login(Request $request){
        $credentials = $request->validate([
            'email'=>'required|email',
            'password'=>'required'
        ]);

        if(!Auth::attempt($credentials)){
            return response()->json(['message' => 'Invalid credentials'],401);
        }

        $user = Auth::user();
        $token = $user->createToken('api-token')->plainTextToken;
        
        return response()->json(['user' => $user,'token' => $token]);
    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully!']);
    }

    public function metrics(){
        $totalUsers = User::where('role','user')->count();
        $totalManagers = User::where('role','manager')->count();
        $totalDrivers = User::where('role','driver')->count();
        $totalTrips = Booking::count();

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalManagers' => $totalManagers,
            'totalDrivers' => $totalDrivers,
            'totalTrips' => $totalTrips,
        ]);
    }
}
