<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portfolio extends Model
{
    use HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'full_detail',
        'project_date',
    ];

    protected function casts(): array
    {
        return [
            'project_date' => 'date',
        ];
    }

    public function images(): HasMany
    {
        return $this->hasMany(PortfolioImage::class);
    }
}
