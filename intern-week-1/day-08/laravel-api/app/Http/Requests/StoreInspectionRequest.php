<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInspectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        if ($this->has('inspection_code') && ! $this->has('inspection_number')) {
            $merge['inspection_number'] = $this->input('inspection_code');
        } elseif (! $this->has('inspection_number')) {
            $merge['inspection_number'] = 'INS-' . date('Y') . '-' . rand(100, 999);
        }

        if ($this->has('outcome') && ! $this->has('result')) {
            $outcome = $this->input('outcome');
            $merge['result'] = match ($outcome) {
                'needs_improvement' => 'conditional_pass',
                'passed' => 'passed',
                'failed' => 'failed',
                'critical_failure' => 'critical_failure',
                default => 'passed',
            };
        }

        if ($this->has('findings') && ! $this->has('notes')) {
            $merge['notes'] = $this->input('findings');
        }

        if ($this->has('requires_follow_up') && ! $this->has('follow_up_required')) {
            $merge['follow_up_required'] = (bool) $this->input('requires_follow_up');
        }

        if (! empty($merge)) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'facility_id' => ['required', 'integer', 'exists:facilities,id'],
            'inspector_id' => ['required', 'integer', 'exists:users,id'],
            'inspection_number' => ['required', 'string', 'max:50', 'unique:inspections,inspection_number'],
            'inspection_date' => ['required', 'date'],
            'result' => ['required', 'string', 'in:passed,conditional_pass,needs_improvement,failed,critical_failure'],
            'score' => ['required', 'integer', 'between:0,100'],
            'notes' => ['nullable', 'string'],
            'follow_up_required' => ['nullable', 'boolean'],
            'follow_up_date' => ['nullable', 'date', 'after_or_equal:inspection_date'],
        ];
    }
}
