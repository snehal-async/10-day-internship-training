<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $complaintId = $this->route('complaint') ?? $this->route('id');

        return [
            'facility_id' => ['sometimes', 'required', 'integer', 'exists:facilities,id'],
            'reporter_id' => ['nullable', 'integer', 'exists:users,id'],
            'assigned_to_id' => ['nullable', 'integer', 'exists:users,id'],
            'ticket_number' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('complaints', 'ticket_number')->ignore($complaintId),
            ],
            'title' => ['sometimes', 'required', 'string', 'max:200'],
            'description' => ['sometimes', 'required', 'string'],
            'severity' => ['sometimes', 'required', 'string', 'in:low,medium,high,urgent'],
            'status' => ['sometimes', 'required', 'string', 'in:open,in_progress,resolved,closed,rejected'],
            'resolution_notes' => ['nullable', 'string'],
            'resolved_at' => ['nullable', 'date'],
        ];
    }
}
