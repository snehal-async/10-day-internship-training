<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $facilityId = $this->route('facility') ?? $this->route('id');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'facility_code' => [
                'sometimes',
                'required',
                'string',
                'max:30',
                Rule::unique('facilities', 'facility_code')->ignore($facilityId),
            ],
            'facility_type' => ['sometimes', 'required', 'string', 'in:office,warehouse,laboratory,datacenter,manufacturing'],
            'address' => ['sometimes', 'required', 'string', 'max:255'],
            'city' => ['sometimes', 'required', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'condition_rating' => ['sometimes', 'required', 'string', 'in:excellent,good,fair,poor,critical'],
            'status' => ['sometimes', 'required', 'string', 'in:operational,under_maintenance,decommissioned,closed'],
            'capacity' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
