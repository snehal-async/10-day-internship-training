<?php

namespace Tests\Feature;

use App\Models\Complaint;
use App\Models\Facility;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class ComplaintApiTest extends TestCase
{
    use RefreshDatabase;

    private string $authToken;
    private User $user;
    private Facility $facility;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::create([
            'name' => 'Support Technician',
            'email' => 'tech@enterprise.local',
            'password' => bcrypt('Password123!'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        $this->facility = Facility::create([
            'name' => 'Distribution Yard',
            'facility_code' => 'FAC-YARD-01',
            'facility_type' => 'warehouse',
            'address' => '12 Wharf Rd',
            'city' => 'Tacoma',
        ]);

        $plain = Str::random(40);
        DB::table('personal_access_tokens')->insert([
            'tokenable_type' => User::class,
            'tokenable_id' => $this->user->id,
            'name' => 'tech_token',
            'token' => hash('sha256', $plain),
            'abilities' => json_encode(['*']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->authToken = $plain;
    }

    public function test_can_list_complaints_publicly(): void
    {
        Complaint::create([
            'facility_id' => $this->facility->id,
            'ticket_number' => 'CMP-TEST-001',
            'title' => 'Leaking Roof',
            'description' => 'Water intrusion in loading bay 2.',
            'severity' => 'medium',
            'status' => 'open',
        ]);

        $response = $this->getJson('/api/complaints');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure(['status', 'data', 'pagination']);
    }

    public function test_can_show_single_complaint_with_relationships(): void
    {
        $complaint = Complaint::create([
            'facility_id' => $this->facility->id,
            'reporter_id' => $this->user->id,
            'assigned_to_id' => $this->user->id,
            'ticket_number' => 'CMP-TEST-002',
            'title' => 'Broken HVAC Fan',
            'description' => 'Motor bearings seizing on unit 4.',
            'severity' => 'high',
            'status' => 'in_progress',
        ]);

        $response = $this->getJson("/api/complaints/{$complaint->id}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.ticket_number', 'CMP-TEST-002')
            ->assertJsonPath('data.reporter.email', 'tech@enterprise.local');
    }

    public function test_can_create_complaint_ticket_when_authenticated(): void
    {
        $payload = [
            'facility_id' => $this->facility->id,
            'ticket_number' => 'CMP-NEW-01',
            'title' => 'Conveyor Belt Jam',
            'description' => 'Secondary sorter conveyor stopped due to mechanical blockage.',
            'severity' => 'urgent',
            'status' => 'open',
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->postJson('/api/complaints', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.ticket_number', 'CMP-NEW-01');

        $this->assertDatabaseHas('complaints', ['ticket_number' => 'CMP-NEW-01']);
    }

    public function test_updating_status_to_resolved_auto_sets_timestamp(): void
    {
        $complaint = Complaint::create([
            'facility_id' => $this->facility->id,
            'ticket_number' => 'CMP-TEST-003',
            'title' => 'Flickering Light',
            'description' => 'Fluorescent light ballast buzzes.',
            'severity' => 'low',
            'status' => 'in_progress',
        ]);

        $this->assertNull($complaint->resolved_at);

        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->putJson("/api/complaints/{$complaint->id}", [
                'status' => 'resolved',
                'resolution_notes' => 'Replaced ballast and bulbs.',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.status', 'resolved');

        $fresh = $complaint->fresh();
        $this->assertNotNull($fresh->resolved_at);
        $this->assertEquals('resolved', $fresh->status);
    }

    public function test_can_delete_complaint(): void
    {
        $complaint = Complaint::create([
            'facility_id' => $this->facility->id,
            'ticket_number' => 'CMP-DEL-01',
            'title' => 'Ticket To Remove',
            'description' => 'Invalid ticket test.',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->authToken}")
            ->deleteJson("/api/complaints/{$complaint->id}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseMissing('complaints', ['id' => $complaint->id]);
    }
}
