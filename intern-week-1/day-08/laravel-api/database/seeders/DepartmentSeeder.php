<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Engineering & Infrastructure',
                'code' => 'DEPT-ENG',
                'description' => 'Facility engineering, HVAC, structural maintenance, and electrical works',
                'budget' => 850000.00,
            ],
            [
                'name' => 'Environmental Health & Safety',
                'code' => 'DEPT-EHS',
                'description' => 'OSHA compliance, hazardous material management, and workplace safety audits',
                'budget' => 520000.00,
            ],
            [
                'name' => 'Information Technology',
                'code' => 'DEPT-IT',
                'description' => 'Network infrastructure, server rooms, data center facilities, and security systems',
                'budget' => 980000.00,
            ],
            [
                'name' => 'Operations & Logistics',
                'code' => 'DEPT-OPS',
                'description' => 'Supply chain distribution, fleet management, and warehouse inventory operations',
                'budget' => 640000.00,
            ],
        ];

        foreach ($departments as $dept) {
            Department::updateOrCreate(['code' => $dept['code']], $dept);
        }
    }
}
