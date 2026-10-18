<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInspectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'facility_id' => ['required', 'integer', 'exists:facilities,id'],
            'inspector_id' => ['required', 'integer', 'exists:users,id'],
            'inspection_number' => ['required', 'string', 'max:50', 'unique:inspections,inspection_number'],
            'inspection_date' => ['required', 'date'],
            'result' => ['required', 'string', 'in:passed,conditional_pass,failed,critical_failure'],
            'score' => ['required', 'integer', 'between:0,100'],
            'notes' => ['nullable', 'string'],
            'follow_up_required' => ['nullable', 'boolean'],
            'follow_up_date' => ['nullable', 'date', 'after_or_equal:inspection_date'],
        ];
    }
}
