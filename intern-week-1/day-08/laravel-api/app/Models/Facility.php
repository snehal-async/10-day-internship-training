<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'facility_code',
        'facility_type',
        'address',
        'city',
        'state',
        'postal_code',
        'condition_rating',
        'status',
        'capacity',
    ];

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
        ];
    }

    public function inspections(): HasMany
    {
        return $this->hasMany(Inspection::class);
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }

    public function scopeOperational(Builder $query): Builder
    {
        return $query->where('status', 'operational');
    }

    public function scopePoorCondition(Builder $query): Builder
    {
        return $query->whereIn('condition_rating', ['poor', 'critical']);
    }
}
