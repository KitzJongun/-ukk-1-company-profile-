<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PageController extends Controller
{
    public function index()
    {
        return PageResource::collection(Page::latest()->get());
    }

    public function show($slug)
    {
        $page = Page::where('slug', $slug)->first();

        if (! $page) {
            return response()->json(['message' => 'Halaman tidak ditemukan'], 404);
        }

        return new PageResource($page);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:5120',
        ]);

        $page = Page::create([
            'title' => $validated['title'],
            'slug' => Page::generateSlug($validated['title']),
            'content' => $validated['content'],
            'image' => $request->hasFile('image')
                ? $request->file('image')->store('pages', 'public')
                : null,
        ]);

        return response()->json([
            'message' => 'Halaman berhasil dibuat',
            'data' => new PageResource($page),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $page = Page::find($id);

        if (! $page) {
            return response()->json(['message' => 'Halaman tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'image' => 'nullable|image|max:5120',
            'remove_image' => 'sometimes|boolean',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $page->title) {
            $page->slug = Page::generateSlug($validated['title'], $page->id);
            $page->title = $validated['title'];
        }

        if (isset($validated['content'])) {
            $page->content = $validated['content'];
        }

        if ($request->hasFile('image')) {
            if ($page->image) {
                Storage::disk('public')->delete($page->image);
            }
            $page->image = $request->file('image')->store('pages', 'public');
        } elseif ($request->boolean('remove_image') && $page->image) {
            Storage::disk('public')->delete($page->image);
            $page->image = null;
        }

        $page->save();

        return response()->json([
            'message' => 'Halaman berhasil diupdate',
            'data' => new PageResource($page),
        ], 200);
    }

    public function destroy($id)
    {
        $page = Page::find($id);

        if (! $page) {
            return response()->json(['message' => 'Halaman tidak ditemukan'], 404);
        }

        if ($page->image) {
            Storage::disk('public')->delete($page->image);
        }

        $page->delete();

        return response()->json(['message' => 'Halaman berhasil dihapus'], 200);
    }
}
