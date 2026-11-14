<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'icon',
    ];
}
