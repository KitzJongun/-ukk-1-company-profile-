<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Form kontak publik.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
            // Honeypot: field tersembunyi di form, hanya diisi bot.
            'website' => 'prohibited',
        ], [
            'website.prohibited' => 'Pesan tidak dapat diproses.',
        ]);

        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
        ]);

        return response()->json([
            'message' => 'Pesan berhasil dikirim',
            'data' => new ContactResource($contact),
        ], 201);
    }

    /**
     * Inbox pesan untuk admin, terbaru di atas dan dipaginasi.
     * Query opsional: `?unread=1` hanya pesan belum dibaca, `?per_page=10`.
     */
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        $query = Contact::latest('created_at');

        if ($request->boolean('unread')) {
            $query->where('is_read', false);
        }

        return ContactResource::collection($query->paginate($perPage));
    }

    /**
     * Tandai satu pesan sebagai sudah dibaca.
     */
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
