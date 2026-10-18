<?php

namespace Database\Seeders;

use App\Models\Complaint;
use App\Models\Facility;
use App\Models\User;
use Illuminate\Database\Seeder;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        $f1 = Facility::where('facility_code', 'FAC-HQ-01')->first();
        $f2 = Facility::where('facility_code', 'FAC-WH-02')->first();
        $f3 = Facility::where('facility_code', 'FAC-LAB-03')->first();
        $f4 = Facility::where('facility_code', 'FAC-DAT-04')->first();
        $f5 = Facility::where('facility_code', 'FAC-MFG-05')->first();
        $f6 = Facility::where('facility_code', 'FAC-STG-06')->first();

        $marcus = User::where('email', 'marcus.inspector@enterprise.local')->first();
        $david = User::where('email', 'david.manager@enterprise.local')->first();
        $amina = User::where('email', 'amina.staff@enterprise.local')->first();
        $carlos = User::where('email', 'carlos.technician@enterprise.local')->first();

        $complaints = [
            [
                'facility_id' => $f1->id,
                'reporter_id' => $amina->id,
                'assigned_to_id' => $carlos->id,
                'ticket_number' => 'CMP-2026-001',
                'title' => '7th Floor Chilled Water Leak',
                'description' => 'Slow condensation drip from ceiling tile near boardroom 7B causing carpet water damage.',
                'severity' => 'medium',
                'status' => 'resolved',
                'resolution_notes' => 'Replaced condensation drain pan pipe and restored ceiling tiles.',
                'resolved_at' => '2026-03-02 14:00:00',
            ],
            [
                'facility_id' => $f2->id,
                'reporter_id' => $david->id,
                'assigned_to_id' => $carlos->id,
                'ticket_number' => 'CMP-2026-002',
                'title' => 'Dock Leveler Hydraulic Fault',
                'description' => 'Bay 4 loading dock hydraulic ramp fails to lift to trailer tailgate height.',
                'severity' => 'high',
                'status' => 'in_progress',
                'resolution_notes' => 'Replacement hydraulic solenoid on order with vendor.',
                'resolved_at' => null,
            ],
            [
                'facility_id' => $f3->id,
                'reporter_id' => $amina->id,
                'assigned_to_id' => $marcus->id,
                'ticket_number' => 'CMP-2026-003',
                'title' => 'Solvent Smell in East Corridor',
                'description' => 'Noticeable chemical solvent odor detected during afternoon distillation run.',
                'severity' => 'urgent',
                'status' => 'in_progress',
                'resolution_notes' => 'Exhaust blower belt tension checked; scheduled for deep duct evacuation.',
                'resolved_at' => null,
            ],
            [
                'facility_id' => $f4->id,
                'reporter_id' => null,
                'assigned_to_id' => $carlos->id,
                'ticket_number' => 'CMP-2026-004',
                'title' => 'CRAC Unit 3 Vibration Warning',
                'description' => 'Secondary computer room air conditioner unit producing audible harmonic resonance.',
                'severity' => 'low',
                'status' => 'open',
                'resolution_notes' => null,
                'resolved_at' => null,
            ],
            [
                'facility_id' => $f5->id,
                'reporter_id' => $david->id,
                'assigned_to_id' => $carlos->id,
                'ticket_number' => 'CMP-2026-005',
                'title' => 'Assembly Bay Overheating',
                'description' => 'Ambient temperatures inside smelting bay exceeding 38 degrees Celsius due to louver failure.',
                'severity' => 'urgent',
                'status' => 'in_progress',
                'resolution_notes' => 'Emergency portable air circulators deployed; primary louvers undergoing rewiring.',
                'resolved_at' => null,
            ],
            [
                'facility_id' => $f5->id,
                'reporter_id' => null,
                'assigned_to_id' => $marcus->id,
                'ticket_number' => 'CMP-2026-006',
                'title' => 'Cracked Load-Bearing Beam',
                'description' => 'Staff observed fresh plaster cracks along ceiling girder after high winds.',
                'severity' => 'urgent',
                'status' => 'open',
                'resolution_notes' => 'Assigned to senior inspector Marcus Vance for immediate structural review.',
                'resolved_at' => null,
            ],
            [
                'facility_id' => $f6->id,
                'reporter_id' => null,
                'assigned_to_id' => null,
                'ticket_number' => 'CMP-2026-007',
                'title' => 'Vandalism on Perimeter Fence',
                'description' => 'Rear security perimeter fence chain-link cut near decommissioned railway spur.',
                'severity' => 'medium',
                'status' => 'open',
                'resolution_notes' => null,
                'resolved_at' => null,
            ],
            [
                'facility_id' => $f1->id,
                'reporter_id' => $amina->id,
                'assigned_to_id' => $carlos->id,
                'ticket_number' => 'CMP-2026-008',
                'title' => 'East Stairwell Light Out',
                'description' => 'Emergency battery backup light flickers and fails in east stairwell between levels 2 and 3.',
                'severity' => 'low',
                'status' => 'resolved',
                'resolution_notes' => 'Replaced ballast and LED tube unit.',
                'resolved_at' => '2026-04-08 16:30:00',
            ],
            [
                'facility_id' => $f2->id,
                'reporter_id' => $david->id,
                'assigned_to_id' => $carlos->id,
                'ticket_number' => 'CMP-2026-009',
                'title' => 'Overhead Rollup Door Sticking',
                'description' => 'Warehouse main access rollup door jams at 2-meter mark intermittently.',
                'severity' => 'medium',
                'status' => 'open',
                'resolution_notes' => null,
                'resolved_at' => null,
            ],
            [
                'facility_id' => $f5->id,
                'reporter_id' => $amina->id,
                'assigned_to_id' => $marcus->id,
                'ticket_number' => 'CMP-2026-010',
                'title' => 'Oil Sheen in Drainage Runoff',
                'description' => 'Minor hydrocarbon sheen noted around rainwater retention basin near foundry wash bay.',
                'severity' => 'high',
                'status' => 'in_progress',
                'resolution_notes' => 'Absorbent booms placed; investigation into oil/water separator functioning ongoing.',
                'resolved_at' => null,
            ],
        ];

        foreach ($complaints as $cmp) {
            Complaint::updateOrCreate(['ticket_number' => $cmp['ticket_number']], $cmp);
        }
    }
}
