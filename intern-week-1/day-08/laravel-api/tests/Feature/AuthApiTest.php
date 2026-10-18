<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_valid_payload(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Alice Engineer',
            'email' => 'alice@enterprise.local',
            'password' => 'SecurePass123!',
            'role' => 'staff',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'role'],
                    'token',
                    'token_type',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'alice@enterprise.local',
            'name' => 'Alice Engineer',
        ]);
    }

    public function test_registration_fails_with_duplicate_email(): void
    {
        User::create([
            'name' => 'Existing User',
            'email' => 'duplicate@enterprise.local',
            'password' => Hash::make('Password123!'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Another User',
            'email' => 'duplicate@enterprise.local',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        User::create([
            'name' => 'Bob Inspector',
            'email' => 'bob@enterprise.local',
            'password' => Hash::make('Secret123!'),
            'role' => 'inspector',
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'bob@enterprise.local',
            'password' => 'Secret123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.user.email', 'bob@enterprise.local')
            ->assertJsonPath('data.token_type', 'Bearer');
    }

    public function test_login_fails_with_invalid_password(): void
    {
        User::create([
            'name' => 'Bob Inspector',
            'email' => 'bob@enterprise.local',
            'password' => Hash::make('Secret123!'),
            'role' => 'inspector',
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'bob@enterprise.local',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('status', 'error');
    }

    public function test_protected_route_rejects_unauthenticated_request(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401)
            ->assertJsonPath('status', 'error');
    }

    public function test_protected_route_allows_authenticated_user(): void
    {
        $regResponse = $this->postJson('/api/auth/register', [
            'name' => 'Carol Admin',
            'email' => 'carol@enterprise.local',
            'password' => 'Secret123!',
            'role' => 'admin',
        ]);

        $token = $regResponse->json('data.token');

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.email', 'carol@enterprise.local');
    }

    public function test_user_can_logout_and_revoke_token(): void
    {
        $regResponse = $this->postJson('/api/auth/register', [
            'name' => 'David Staff',
            'email' => 'david@enterprise.local',
            'password' => 'Secret123!',
        ]);

        $token = $regResponse->json('data.token');

        // Logout
        $logoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/auth/logout');

        $logoutResponse->assertStatus(200);

        // Attempt using token again -> should now be rejected 401
        $meResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/auth/me');

        $meResponse->assertStatus(401);
    }
}
