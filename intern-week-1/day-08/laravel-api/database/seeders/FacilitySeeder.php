<?php

namespace Database\Seeders;

use App\Models\Facility;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    public function run(): void
    {
        $facilities = [
            [
                'name' => 'Metropolis Corporate HQ',
                'facility_code' => 'FAC-HQ-01',
                'facility_type' => 'office',
                'address' => '100 Enterprise Way',
                'city' => 'Seattle',
                'state' => 'WA',
                'postal_code' => '98101',
                'condition_rating' => 'excellent',
                'status' => 'operational',
                'capacity' => 1500,
            ],
            [
                'name' => 'Pacific Northwest Logistics Depot',
                'facility_code' => 'FAC-WH-02',
                'facility_type' => 'warehouse',
                'address' => '450 Harbor Boulevard',
                'city' => 'Tacoma',
                'state' => 'WA',
                'postal_code' => '98421',
                'condition_rating' => 'good',
                'status' => 'operational',
                'capacity' => 350,
            ],
            [
                'name' => 'Cascade BioChemical Research Lab',
                'facility_code' => 'FAC-LAB-03',
                'facility_type' => 'laboratory',
                'address' => '720 Science Parkway',
                'city' => 'Bellevue',
                'state' => 'WA',
                'postal_code' => '98004',
                'condition_rating' => 'fair',
                'status' => 'operational',
                'capacity' => 120,
            ],
            [
                'name' => 'Olympus Tier IV Data Center',
                'facility_code' => 'FAC-DAT-04',
                'facility_type' => 'datacenter',
                'address' => '880 Cloud Ridge Rd',
                'city' => 'Redmond',
                'state' => 'WA',
                'postal_code' => '98052',
                'condition_rating' => 'excellent',
                'status' => 'operational',
                'capacity' => 80,
            ],
            [
                'name' => 'Rainier Industrial Foundry',
                'facility_code' => 'FAC-MFG-05',
                'facility_type' => 'manufacturing',
                'address' => '1200 Ruston Way',
                'city' => 'Tacoma',
                'state' => 'WA',
                'postal_code' => '98402',
                'condition_rating' => 'poor',
                'status' => 'under_maintenance',
                'capacity' => 450,
            ],
            [
                'name' => 'Pioneer Square Annex Depot',
                'facility_code' => 'FAC-STG-06',
                'facility_type' => 'warehouse',
                'address' => '310 1st Avenue South',
                'city' => 'Seattle',
                'state' => 'WA',
                'postal_code' => '98104',
                'condition_rating' => 'critical',
                'status' => 'closed',
                'capacity' => 50,
            ],
        ];

        foreach ($facilities as $facility) {
            Facility::updateOrCreate(['facility_code' => $facility['facility_code']], $facility);
        }
    }
}
