<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // We'll make its frontend later -- 20/09/25
    public function register(Request $request)
    {
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

        event(new Registered($user));

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['message' =>'User registration successful. Please check your email for verification.','user' => $user, 'token' => $token]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email',$request->email)->first();
        if(!$user || !Hash::check($request->password,$user->password)){
            return response()->json(['message' => 'Invalid credentials'],401);
        }

        if(!$user->hasVerifiedEmail()){
            return response()->json(['message'=>'Please verify your email first'],403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'Login Successfully!',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully!']);
    }

    public function metrics()
    {
        $totalUsers = User::where('role', 'user')->count();
        $totalManagers = User::where('role', 'manager')->count();
        $totalDrivers = User::where('role', 'driver')->count();
        $totalTrips = Booking::count();

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalManagers' => $totalManagers,
            'totalDrivers' => $totalDrivers,
            'totalTrips' => $totalTrips,
        ]);
    }

    // Email verification
    public function verifyEmail($id,$hash){
        $user = User::findOrFail($id);
        if(!hash_equals((string) $hash,sha1($user->getEmailForVerification()))){
            return redirect('http://localhost:5173/email-verification-failed');
        }

        if(!$user->hasVerifiedEmail()){
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        return redirect('http://localhost:5173/?verified=1');
    }

    public function resendVerificationEmail(Request $request){
        $user = User::where('email',$request->email)->first();
        if(!$user){
            return response()->json(['message' => 'User not found!'],404);
        }

        if($user->hasVerifiedEmail()){
            return response()->json(['message' => 'Email already verified!'],400);
        }

        $user->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification email resent']);
    }
}
