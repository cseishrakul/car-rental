<?php

namespace App\Http\Controllers;

use App\Models\DriverProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DriverController extends Controller
{
    public function driverRegister(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:30',
            'address' => 'nullable|string',
            'license_number' => 'required|string|max:100',
            'nid' => 'nullable|string|max:100',
            'experience_years' => 'nullable|integer|min:0',
            'password' => 'required|string|min:6|confirmed',
            'license_image' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'nid_image' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'profile_image' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        $user = User::create([
            'name' => trim($data['first_name'] . ' ' . ($data['last_name'] ?? '')),
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'driver',
            'email_verified_at' => null
        ]);

        $licenseImagePath = $request->hasFile('license_image') ? $request->file('license_image')->store('drivers/licenses', 'public') : null;

        $nidImagePath = $request->hasFile('nid_image') ? $request->file('nid_image')->store('drivers/nids', 'public') : null;

        $profilePhotoPath = $request->hasFile('profile_photo') ? $request->file('profile_photo')->store('drivers/profile', 'public') : null;

        $profile = DriverProfile::create([
            'user_id' => $user->id,
            'phone' => $data['phone'],
            'address' => $data['address'] ?? null,
            'license_number' => $data['license_number'],
            'nid' => $data['nid'] ?? null,
            'experience_years' => $data['experience_years'] ?? null,
            'license_image' => $licenseImagePath ? asset('storage/'.$licenseImagePath):null,
            'nid_image' => $nidImagePath ? asset('storage/'.$nidImagePath):null,
            'profile_photo' => $profilePhotoPath ? asset('storage/'.$profilePhotoPath):null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Driver Registration Done.Awaiting For Manager To Approve It!',
            'driver' => [
                'user' => $user->only(['id','name','email','role']),
                'profile' => $profile
            ]
        ],201);
    }
}
