<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:255',
            'full_detail' => 'required|string',
            'project_date' => 'required|date',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
        ];
    }
}
