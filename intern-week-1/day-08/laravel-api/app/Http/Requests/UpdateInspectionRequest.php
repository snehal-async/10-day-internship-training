<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInspectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $inspectionId = $this->route('inspection') ?? $this->route('id');

        return [
            'facility_id' => ['sometimes', 'required', 'integer', 'exists:facilities,id'],
            'inspector_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'inspection_number' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('inspections', 'inspection_number')->ignore($inspectionId),
            ],
            'inspection_date' => ['sometimes', 'required', 'date'],
            'result' => ['sometimes', 'required', 'string', 'in:passed,conditional_pass,failed,critical_failure'],
            'score' => ['sometimes', 'required', 'integer', 'between:0,100'],
            'notes' => ['nullable', 'string'],
            'follow_up_required' => ['nullable', 'boolean'],
            'follow_up_date' => ['nullable', 'date'],
        ];
    }
}
