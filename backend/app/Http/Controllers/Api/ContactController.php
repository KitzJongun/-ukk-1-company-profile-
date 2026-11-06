<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // Fungsi untuk form publik (Guest)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        ContactMessage::create($request->all());

        return response()->json(['message' => 'Pesan berhasil dikirim'], 201);
    }

    public function index()
    {
        // Ambil semua pesan, urutkan dari yang paling baru
        return response()->json(ContactMessage::latest()->get(), 200);
    }
}
