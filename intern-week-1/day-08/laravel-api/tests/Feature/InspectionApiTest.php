<?php

namespace Tests\Feature;

use App\Models\Facility;
use App\Models\Inspection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class InspectionApiTest extends TestCase
{
    use RefreshDatabase;

    private string $authToken;
    private User $inspector;
    private Facility $facility;

    protected function setUp(): void
    {
        parent::setUp();

        $this->inspector = User::create([
            'name' => 'Lead Inspector',
            'email' => 'inspector@enterprise.local',
            'password' => bcrypt('Password123!'),
            'role' => 'inspector',
            'is_active' => true,
        ]);

        $this->facility = Facility::create([
            'name' => 'Test Plant',
            'facility_code' => 'FAC-TEST-99',
            'facility_type' => 'manufacturing',
            'address' => '77 Factory Way',
            'city' => 'Auburn',
            'condition_rating' => 'fair',
            'status' => 'operational',
        ]);

        $plain = Str::random(40);
        DB::table('personal_access_tokens')->insert([
            'tokenable_type' => User::class,
            'tokenable_id' => $this->inspector->id,
            'name' => 'test_token',
            'token' => hash('sha256', $plain),
            'abilities' => json_encode(['*']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->authToken = $plain;
    }

    public function test_can_list_inspections(): void
    {
        Inspection::create([
            'facility_id' => $this->facility->id,
            'inspector_id' => $this->inspector->id,
            'inspection_number' => 'INSP-TEST-01',
            'inspection_date' => '2026-03-01',
            'result' => 'passed',
            'score' => 95,
        ]);

        $response = $this->getJson('/api/inspections');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure(['status', 'data', 'pagination']);
    }

    public function test_can_show_inspection(): void
    {
        $inspection = Inspection::create([
            'facility_id' => $this->facility->id,
            'inspector_id' => $this->inspector->id,
            'inspection_number' => 'INSP-TEST-02',
            'inspection_date' => '2026-03-05',
            'result' => 'conditional_pass',
            'score' => 75,
        ]);

        $response = $this->getJson("/api/inspections/{$inspection->id}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.inspection_number', 'INSP-TEST-02')
            ->assertJsonPath('data.facility.facility_code', 'FAC-TEST-99')
            ->assertJsonPath('data.inspector.email', 'inspector@enterprise.local');
    }

    public function test_create_inspection_fails_with_nonexistent_facility_or_illegal_score(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->postJson('/api/inspections', [
                'facility_id' => 99999, // Nonexistent foreign key
                'inspector_id' => $this->inspector->id,
                'inspection_number' => 'INSP-ERR-01',
                'inspection_date' => '2026-04-01',
                'result' => 'passed',
                'score' => 150, // Illegal: score > 100
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['facility_id', 'score']);
    }

    public function test_can_create_valid_inspection_when_authenticated(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->postJson('/api/inspections', [
                'facility_id' => $this->facility->id,
                'inspector_id' => $this->inspector->id,
                'inspection_number' => 'INSP-NEW-01',
                'inspection_date' => '2026-04-10',
                'result' => 'passed',
                'score' => 98,
                'notes' => 'Complete electrical verification passed.',
                'follow_up_required' => false,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.score', 98);

        $this->assertDatabaseHas('inspections', ['inspection_number' => 'INSP-NEW-01']);
    }

    public function test_can_delete_inspection(): void
    {
        $inspection = Inspection::create([
            'facility_id' => $this->facility->id,
            'inspector_id' => $this->inspector->id,
            'inspection_number' => 'INSP-DEL-01',
            'inspection_date' => '2026-04-12',
            'result' => 'failed',
            'score' => 45,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->deleteJson("/api/inspections/{$inspection->id}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseMissing('inspections', ['id' => $inspection->id]);
    }
}
