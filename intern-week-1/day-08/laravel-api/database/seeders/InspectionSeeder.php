<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Inspection;
use App\Models\User;
use Illuminate\Database\Seeder;

class InspectionSeeder extends Seeder
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
        $elena = User::where('email', 'elena.inspector@enterprise.local')->first();

        $inspections = [
            [
                'facility_id' => $f1->id,
                'inspector_id' => $marcus->id,
                'inspection_number' => 'INSP-2026-001',
                'inspection_date' => '2026-01-15',
                'result' => 'passed',
                'score' => 96,
                'notes' => 'All fire suppressions, emergency exits, and ADA pathways fully compliant.',
                'follow_up_required' => false,
                'follow_up_date' => null,
            ],
            [
                'facility_id' => $f2->id,
                'inspector_id' => $marcus->id,
                'inspection_number' => 'INSP-2026-002',
                'inspection_date' => '2026-02-10',
                'result' => 'passed',
                'score' => 88,
                'notes' => 'Forklift lanes clearly marked. Minor wear on dock bumpers noted.',
                'follow_up_required' => false,
                'follow_up_date' => null,
            ],
            [
                'facility_id' => $f3->id,
                'inspector_id' => $elena->id,
                'inspection_number' => 'INSP-2026-003',
                'inspection_date' => '2026-02-28',
                'result' => 'conditional_pass',
                'score' => 72,
                'notes' => 'Fume hood ventilation filter nearing saturation. Chemical storage signage faded.',
                'follow_up_required' => true,
                'follow_up_date' => '2026-04-15',
            ],
            [
                'facility_id' => $f4->id,
                'inspector_id' => $elena->id,
                'inspection_number' => 'INSP-2026-004',
                'inspection_date' => '2026-03-05',
                'result' => 'passed',
                'score' => 99,
                'notes' => 'Dual-loop redundant cooling operating at optimal delta T. Clean room rating sustained.',
                'follow_up_required' => false,
                'follow_up_date' => null,
            ],
            [
                'facility_id' => $f5->id,
                'inspector_id' => $marcus->id,
                'inspection_number' => 'INSP-2026-005',
                'inspection_date' => '2026-03-18',
                'result' => 'failed',
                'score' => 48,
                'notes' => 'Primary furnace pressure sensor calibrating erratically. Multiple emergency lights unpowered.',
                'follow_up_required' => true,
                'follow_up_date' => '2026-04-01',
            ],
            [
                'facility_id' => $f5->id,
                'inspector_id' => $elena->id,
                'inspection_number' => 'INSP-2026-006',
                'inspection_date' => '2026-04-02',
                'result' => 'critical_failure',
                'score' => 35,
                'notes' => 'Roof structural beam shows noticeable deflection above assembly line 2. Immediate cessation recommended.',
                'follow_up_required' => true,
                'follow_up_date' => '2026-04-20',
            ],
            [
                'facility_id' => $f6->id,
                'inspector_id' => $marcus->id,
                'inspection_number' => 'INSP-2026-007',
                'inspection_date' => '2026-01-20',
                'result' => 'critical_failure',
                'score' => 22,
                'notes' => 'Asbestos ceiling panel disruption and water intrusion in basement. Building declared unfit.',
                'follow_up_required' => true,
                'follow_up_date' => '2026-02-15',
            ],
            [
                'facility_id' => $f1->id,
                'inspector_id' => $elena->id,
                'inspection_number' => 'INSP-2026-008',
                'inspection_date' => '2026-04-10',
                'result' => 'passed',
                'score' => 94,
                'notes' => 'Semi-annual sprinkler pressure review passed. Elevator cables inspected and certified.',
                'follow_up_required' => false,
                'follow_up_date' => null,
            ],
        ];

        foreach ($inspections as $insp) {
            Inspection::updateOrCreate(['inspection_number' => $insp['inspection_number']], $insp);
        }
    }
}
