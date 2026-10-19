<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        if (! $this->has('ticket_number') || empty($this->input('ticket_number'))) {
            $merge['ticket_number'] = 'CMP-' . date('Y') . '-' . rand(1000, 9999);
        }

        if ($this->has('priority') && ! $this->has('severity')) {
            $priority = strtolower($this->input('priority'));
            $merge['severity'] = match ($priority) {
                'urgent', 'critical' => 'urgent',
                'high' => 'high',
                'low' => 'low',
                default => 'medium',
            };
        }

        if (! empty($merge)) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'facility_id' => ['required', 'integer', 'exists:facilities,id'],
            'reporter_id' => ['nullable', 'integer', 'exists:users,id'],
            'assigned_to_id' => ['nullable', 'integer', 'exists:users,id'],
            'ticket_number' => ['required', 'string', 'max:50', 'unique:complaints,ticket_number'],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'severity' => ['nullable', 'string', 'in:low,medium,high,urgent'],
            'status' => ['nullable', 'string', 'in:open,in_progress,resolved,closed,rejected'],
            'resolution_notes' => ['nullable', 'string'],
            'resolved_at' => ['nullable', 'date'],
        ];
    }
}
