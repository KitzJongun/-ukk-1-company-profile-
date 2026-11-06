<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    // 1. Tampilkan semua halaman (Bisa diakses publik)
    public function index()
    {
        return response()->json(Page::all(), 200);
    }

    // 2. Tampilkan 1 halaman berdasarkan slug (Bisa diakses publik)
    public function show($slug)
    {
        $page = Page::where('slug', $slug)->first();
        if (!$page) {
            return response()->json(['message' => 'Halaman tidak ditemukan'], 404);
        }
        return response()->json($page, 200);
    }

    // 3. Tambah halaman baru (Khusus Admin)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'main_image_url' => 'nullable|url',
        ]);

        $page = Page::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'content' => $request->content,
            'main_image_url' => $request->main_image_url,
        ]);

        return response()->json(['message' => 'Halaman berhasil dibuat', 'data' => $page], 201);
    }

    // 4. Update halaman (Khusus Admin)
    public function update(Request $request, $id)
    {
        $page = Page::find($id);
        if (!$page) {
            return response()->json(['message' => 'Halaman tidak ditemukan'], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required',
        ]);

        $page->update([
            'title' => $request->title ?? $page->title,
            'slug' => $request->title ? Str::slug($request->title) : $page->slug,
            'content' => $request->content ?? $page->content,
            'main_image_url' => $request->main_image_url ?? $page->main_image_url,
        ]);

        return response()->json(['message' => 'Halaman berhasil diupdate', 'data' => $page], 200);
    }

    // 5. Hapus halaman (Khusus Admin)
    public function destroy($id)
    {
        $page = Page::find($id);
        if (!$page) {
            return response()->json(['message' => 'Halaman tidak ditemukan'], 404);
        }

        $page->delete();
        return response()->json(['message' => 'Halaman berhasil dihapus'], 200);
    }
}