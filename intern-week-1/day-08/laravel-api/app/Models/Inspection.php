<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inspection extends Model
{
    use HasFactory;

    protected $fillable = [
        'facility_id',
        'inspector_id',
        'inspection_number',
        'inspection_date',
        'result',
        'score',
        'notes',
        'follow_up_required',
        'follow_up_date',
    ];

    protected function casts(): array
    {
        return [
            'inspection_date' => 'date',
            'follow_up_date' => 'date',
            'score' => 'integer',
            'follow_up_required' => 'boolean',
        ];
    }

    protected $appends = [
        'inspection_code',
        'outcome',
        'findings',
        'requires_follow_up',
    ];

    public function getInspectionCodeAttribute(): ?string
    {
        return $this->inspection_number;
    }

    public function getOutcomeAttribute(): ?string
    {
        return $this->result;
    }

    public function getFindingsAttribute(): ?string
    {
        return $this->notes;
    }

    public function getRequiresFollowUpAttribute(): ?bool
    {
        return (bool) $this->follow_up_required;
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }
}
