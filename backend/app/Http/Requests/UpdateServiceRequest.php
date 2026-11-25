<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'short_description' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|image|max:5120',
            'remove_icon' => 'sometimes|boolean',
        ];
    }
}
