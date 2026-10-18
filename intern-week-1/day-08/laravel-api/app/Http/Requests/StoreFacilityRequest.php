<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'facility_code' => ['required', 'string', 'max:30', 'unique:facilities,facility_code'],
            'facility_type' => ['required', 'string', 'in:office,warehouse,laboratory,datacenter,manufacturing'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'condition_rating' => ['nullable', 'string', 'in:excellent,good,fair,poor,critical'],
            'status' => ['nullable', 'string', 'in:operational,under_maintenance,decommissioned,closed'],
            'capacity' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
