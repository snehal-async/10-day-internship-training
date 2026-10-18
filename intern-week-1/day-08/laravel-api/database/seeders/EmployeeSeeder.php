<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $eng = Department::where('code', 'DEPT-ENG')->first();
        $ehs = Department::where('code', 'DEPT-EHS')->first();
        $it = Department::where('code', 'DEPT-IT')->first();
        $ops = Department::where('code', 'DEPT-OPS')->first();

        $employees = [
            [
                'department_id' => $eng->id,
                'first_name' => 'Robert',
                'last_name' => 'Sterling',
                'email' => 'r.sterling@enterprise.local',
                'job_title' => 'Lead Mechanical Engineer',
                'salary' => 98000.00,
                'hire_date' => '2021-03-15',
                'status' => 'active',
            ],
            [
                'department_id' => $eng->id,
                'first_name' => 'Grace',
                'last_name' => 'Hopper',
                'email' => 'g.hopper@enterprise.local',
                'job_title' => 'Electrical Systems Specialist',
                'salary' => 87500.00,
                'hire_date' => '2022-07-01',
                'status' => 'active',
            ],
            [
                'department_id' => $eng->id,
                'first_name' => 'Thomas',
                'last_name' => 'Edison',
                'email' => 't.edison@enterprise.local',
                'job_title' => 'HVAC Maintenance Technician',
                'salary' => 62000.00,
                'hire_date' => '2023-01-10',
                'status' => 'active',
            ],
            [
                'department_id' => $ehs->id,
                'first_name' => 'Rachel',
                'last_name' => 'Carson',
                'email' => 'r.carson@enterprise.local',
                'job_title' => 'Chief Safety Officer',
                'salary' => 105000.00,
                'hire_date' => '2020-05-18',
                'status' => 'active',
            ],
            [
                'department_id' => $ehs->id,
                'first_name' => 'John',
                'last_name' => 'Muir',
                'email' => 'j.muir@enterprise.local',
                'job_title' => 'Environmental Compliance Auditor',
                'salary' => 76000.00,
                'hire_date' => '2022-09-20',
                'status' => 'active',
            ],
            [
                'department_id' => $ehs->id,
                'first_name' => 'Leila',
                'last_name' => 'Nazari',
                'email' => 'l.nazari@enterprise.local',
                'job_title' => 'Hazardous Materials Coordinator',
                'salary' => 69000.00,
                'hire_date' => '2023-11-05',
                'status' => 'active',
            ],
            [
                'department_id' => $it->id,
                'first_name' => 'Alan',
                'last_name' => 'Turing',
                'email' => 'a.turing@enterprise.local',
                'job_title' => 'Principal Infrastructure Architect',
                'salary' => 135000.00,
                'hire_date' => '2019-11-01',
                'status' => 'active',
            ],
            [
                'department_id' => $it->id,
                'first_name' => 'Ada',
                'last_name' => 'Lovelace',
                'email' => 'a.lovelace@enterprise.local',
                'job_title' => 'Data Center Operations Lead',
                'salary' => 112000.00,
                'hire_date' => '2021-02-14',
                'status' => 'active',
            ],
            [
                'department_id' => $it->id,
                'first_name' => 'Linus',
                'last_name' => 'Torvalds',
                'email' => 'l.torvalds@enterprise.local',
                'job_title' => 'Systems Administrator',
                'salary' => 89000.00,
                'hire_date' => '2022-06-15',
                'status' => 'active',
            ],
            [
                'department_id' => $ops->id,
                'first_name' => 'Henry',
                'last_name' => 'Ford',
                'email' => 'h.ford@enterprise.local',
                'job_title' => 'Logistics Director',
                'salary' => 102000.00,
                'hire_date' => '2020-08-01',
                'status' => 'active',
            ],
            [
                'department_id' => $ops->id,
                'first_name' => 'Margaret',
                'last_name' => 'Hamilton',
                'email' => 'm.hamilton@enterprise.local',
                'job_title' => 'Warehouse Operations Supervisor',
                'salary' => 74000.00,
                'hire_date' => '2022-04-12',
                'status' => 'active',
            ],
            [
                'department_id' => $ops->id,
                'first_name' => 'Frank',
                'last_name' => 'Sinatra',
                'email' => 'f.sinatra@enterprise.local',
                'job_title' => 'Dispatch Coordinator',
                'salary' => 51000.00,
                'hire_date' => '2024-02-01',
                'status' => 'active',
            ],
        ];

        foreach ($employees as $emp) {
            Employee::updateOrCreate(['email' => $emp['email']], $emp);
        }
    }
}
