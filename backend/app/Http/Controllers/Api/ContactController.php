<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(ContactRequest $request)
    {
        $validated = $request->validated();

        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'] ?? null,
            'message' => $validated['message'],
        ]);

        return response()->json([
            'message' => 'Pesan berhasil dikirim',
            'data' => new ContactResource($contact),
        ], 201);
    }

    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        $query = Contact::latest('created_at');

        if ($request->boolean('unread')) {
            $query->where('is_read', false);
        }

        return ContactResource::collection($query->paginate($perPage));
    }

    public function markAsRead($id)
    {
        $contact = Contact::find($id);

        if (! $contact) {
            return response()->json(['message' => 'Pesan tidak ditemukan'], 404);
        }

        if (! $contact->is_read) {
            $contact->update(['is_read' => true]);
        }

        return response()->json([
            'message' => 'Pesan ditandai sudah dibaca',
            'data' => new ContactResource($contact),
        ]);
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (! $contact) {
            return response()->json(['message' => 'Pesan tidak ditemukan'], 404);
        }

        $contact->delete();

        return response()->json(['message' => 'Pesan berhasil dihapus']);
    }
}
