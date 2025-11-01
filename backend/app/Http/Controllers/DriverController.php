<?php

namespace App\Http\Controllers;

use App\Models\DriverProfile;
use App\Models\User;
use App\Notifications\DriverApplicationCreate;
use Illuminate\Auth\Events\Registered;
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
            'license_image' => 'nullable|string',
            'nid_image' => 'nullable|string',
            'profile_photo' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => trim($data['first_name'] . ' ' . ($data['last_name'] ?? '')),
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'driver',
            'email_verified_at' => null
        ]);
        $profile = DriverProfile::create([
            'user_id' => $user->id,
            'phone' => $data['phone'],
            'address' => $data['address'] ?? null,
            'license_number' => $data['license_number'],
            'nid' => $data['nid'] ?? null,
            'experience_years' => $data['experience_years'] ?? null,
            'license_image' => $data['license_image'] ?? null,
            'nid_image' => $data['nid_image'] ?? null,
            'profile_photo' => $data['profile_photo'] ?? null
        ]);

        event(new Registered($user));

        $adminsAndManagers = User::whereIn('role',['admin','manager'])->get();
        foreach($adminsAndManagers as $user){
            $user->notify(new DriverApplicationCreate($driver));
        }

        return response()->json([
            'message' => 'Driver Registration Done.Please confirm your email & Wait For Manager To Approve It!',
            'driver' => [
                'user' => $user->only(['id', 'name', 'email', 'role']),
                'profile' => $profile
            ]
        ], 201);
    }


    public function pending(Request $request)
    {
        $auth = $request->user();
        if (!$auth || !in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $drivers = DriverProfile::with('user')->where('status', 'pending')->paginate(20);
        return response()->json($drivers);
    }

    public function approve(Request $request, $id)
    {
        $auth = $request->user();
        if (!$auth || !in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'assigned_car_id' => 'nullable|exists:cars,id',
        ]);

        $profile = DriverProfile::find($id);

        if (!$profile) return response()->json(['message' => 'Driver not found!'], 404);

        $profile->status = 'approved';
        $profile->assigned_car_id = $data['assigned_car_id'] ?? null;
        $profile->save();

        // optionally send email to driver

        return response()->json([
            'message' => 'Driver Approved and car has been assigned!',
            'profile' => $profile->load('user', 'car')
        ]);
    }

    public function reject(Request $request, $id)
    {
        $auth = $request->user();
        if (!$auth || !in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $profile = DriverProfile::find($id);
        if (!$profile) return response()->json(['message' => 'Driver not found'], 404);

        $profile->status = 'rejected';
        $profile->save();

        return response()->json(['message' => 'Driver rejectd', 'profile' => $profile]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'driver') {
            return response()->json(['message' => 'You are not a driver!'], 403);
        }

        $profile = $user->driverProfile()->with('car')->first();
        return response()->json(['user' => $user, 'profile' => $profile]);
    }


    public function index(Request $request)
    {
        $auth = $request->user();
        if (!$auth || !in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $drivers = DriverProfile::with('user', 'car')->paginate(20);
        return response()->json($drivers);
    }

    public function setPending(Request $request, $id)
    {
        $auth = $request->user();
        if (!$auth || !in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $profile = DriverProfile::find($id);
        if (!$profile) return response()->json(['message' => 'Driver not found'], 404);
        $profile->status = 'pending';
        $profile->save();

        return response()->json(['message' => 'Driver set to pending again', 'profile' => $profile]);
    }

    public function assignCar(Request $request, $id)
    {
        $auth = $request->user();
        if (!$auth || !in_array($auth->role, ['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'assigned_car_id' => 'required|exists:cars,id'
        ]);

        $profile = DriverProfile::find($id);
        if (!$profile) return response()->json(['message' => 'Driver not found'], 404);

        $profile->assigned_car_id = $data['assigned_car_id'];

        $profile->save();

        return response()->json(['message' => 'Car re-assigned to driver', 'profile' => $profile->load('car')]);
    }
}
