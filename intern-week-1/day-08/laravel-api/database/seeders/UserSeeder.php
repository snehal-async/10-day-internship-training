<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Sarah Jenkins',
                'email' => 'sarah.admin@enterprise.local',
                'password' => Hash::make('Password123!'),
                'role' => 'admin',
                'is_active' => true,
            ],
            [
                'name' => 'Marcus Vance',
                'email' => 'marcus.inspector@enterprise.local',
                'password' => Hash::make('Password123!'),
                'role' => 'inspector',
                'is_active' => true,
            ],
            [
                'name' => 'Elena Rostova',
                'email' => 'elena.inspector@enterprise.local',
                'password' => Hash::make('Password123!'),
                'role' => 'inspector',
                'is_active' => true,
            ],
            [
                'name' => 'David Kim',
                'email' => 'david.manager@enterprise.local',
                'password' => Hash::make('Password123!'),
                'role' => 'manager',
                'is_active' => true,
            ],
            [
                'name' => 'Amina Al-Mansoor',
                'email' => 'amina.staff@enterprise.local',
                'password' => Hash::make('Password123!'),
                'role' => 'staff',
                'is_active' => true,
            ],
            [
                'name' => 'Carlos Mendez',
                'email' => 'carlos.technician@enterprise.local',
                'password' => Hash::make('Password123!'),
                'role' => 'staff',
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['email' => $user['email']], $user);
        }
    }
}
