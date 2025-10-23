<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SocialAuthController extends Controller
{
    public function socialLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'social_id' => 'required|string',
            'provider' => 'required|string',
        ]);

        $user = User::updateOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                'social_id' => $request->social_id,
                'provider' => $request->provider,
                'password' => bcrypt('password')
            ]
        );
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }
}
