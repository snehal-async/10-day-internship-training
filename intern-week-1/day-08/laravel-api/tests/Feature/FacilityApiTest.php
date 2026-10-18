<?php

namespace Tests\Feature;

use App\Models\Facility;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class FacilityApiTest extends TestCase
{
    use RefreshDatabase;

    private string $authToken;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::create([
            'name' => 'Admin Test',
            'email' => 'admin.test@enterprise.local',
            'password' => bcrypt('Password123!'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $plain = Str::random(40);
        DB::table('personal_access_tokens')->insert([
            'tokenable_type' => User::class,
            'tokenable_id' => $user->id,
            'name' => 'test_token',
            'token' => hash('sha256', $plain),
            'abilities' => json_encode(['*']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->authToken = $plain;
    }

    public function test_can_list_facilities_publicly(): void
    {
        Facility::create([
            'name' => 'HQ West',
            'facility_code' => 'FAC-TEST-01',
            'facility_type' => 'office',
            'address' => '100 Main St',
            'city' => 'Seattle',
            'condition_rating' => 'excellent',
            'status' => 'operational',
            'capacity' => 500,
        ]);

        $response = $this->getJson('/api/facilities');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure(['status', 'data', 'pagination']);
    }

    public function test_can_show_single_facility(): void
    {
        $facility = Facility::create([
            'name' => 'Research Lab Alpha',
            'facility_code' => 'FAC-TEST-02',
            'facility_type' => 'laboratory',
            'address' => '200 Science Way',
            'city' => 'Bellevue',
            'condition_rating' => 'good',
            'status' => 'operational',
            'capacity' => 150,
        ]);

        $response = $this->getJson("/api/facilities/{$facility->id}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.facility_code', 'FAC-TEST-02');
    }

    public function test_show_returns_404_for_nonexistent_facility(): void
    {
        $response = $this->getJson('/api/facilities/99999');

        $response->assertStatus(404)
            ->assertJsonPath('status', 'error');
    }

    public function test_creating_facility_requires_authentication(): void
    {
        $response = $this->postJson('/api/facilities', [
            'name' => 'Unauthorized Hub',
            'facility_code' => 'FAC-UNAUTH',
            'facility_type' => 'warehouse',
            'address' => '300 Pier St',
            'city' => 'Tacoma',
        ]);

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_facility(): void
    {
        $payload = [
            'name' => 'North Distribution Center',
            'facility_code' => 'FAC-DIST-01',
            'facility_type' => 'warehouse',
            'address' => '500 Logistics Loop',
            'city' => 'Everett',
            'state' => 'WA',
            'postal_code' => '98201',
            'condition_rating' => 'good',
            'status' => 'operational',
            'capacity' => 300,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->postJson('/api/facilities', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.facility_code', 'FAC-DIST-01');

        $this->assertDatabaseHas('facilities', ['facility_code' => 'FAC-DIST-01']);
    }

    public function test_facility_creation_fails_validation_for_missing_fields_or_invalid_condition(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->postJson('/api/facilities', [
                'name' => '', // Required
                'facility_type' => 'invalid_type', // Invalid ENUM
                'condition_rating' => 'broken', // Invalid condition
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'facility_code', 'facility_type', 'address', 'city', 'condition_rating']);
    }

    public function test_can_update_facility(): void
    {
        $facility = Facility::create([
            'name' => 'Old Depot',
            'facility_code' => 'FAC-OLD-01',
            'facility_type' => 'warehouse',
            'address' => '10 Old Road',
            'city' => 'Kent',
            'condition_rating' => 'fair',
            'status' => 'operational',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->putJson("/api/facilities/{$facility->id}", [
                'name' => 'Renovated Depot',
                'condition_rating' => 'good',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.name', 'Renovated Depot')
            ->assertJsonPath('data.condition_rating', 'good');
    }

    public function test_can_delete_facility(): void
    {
        $facility = Facility::create([
            'name' => 'Facility To Delete',
            'facility_code' => 'FAC-DEL-01',
            'facility_type' => 'office',
            'address' => '999 Delete Ave',
            'city' => 'Renton',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->deleteJson("/api/facilities/{$facility->id}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseMissing('facilities', ['id' => $facility->id]);
    }
}
