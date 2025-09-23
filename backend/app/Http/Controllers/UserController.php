<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function storeManager(Request $request)
    {
        $auth = $request->user();
        if (!$auth || $auth->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email'
        ]);

        // Company provided password
        $password = 'manager';
        $manager = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($password),
            'role' => 'manager',
            'email_verified_at' => now()
        ]);

        return response()->json([
            'message' => 'Manager created successfully!',
            'manager' => $manager->only(['id', 'name', 'email', 'role']),
            'default_password' => $password
        ], 201);
    }

    public function indexManager(Request $request)
    {
        $auth = $request->user();
        if (!$auth || $auth->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $managers = User::where('role', 'manager')->select('id', 'name', 'email', 'created_at')->paginate(5);
        return response()->json($managers);
    }

    public function destroyManager(Request $request, $id)
    {
        $auth = $request->user();
        if (!$auth || $auth->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $manager = User::where('id', $id)->where('role', 'manager')->first();

        if (!$manager) {
            return response()->json(['message' => 'Manager not found!'], 404);
        }

        $manager->delete();
        return response()->json(['message' => 'Manager Deleted!']);
    }
}
