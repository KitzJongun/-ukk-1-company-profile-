<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioResource;
use App\Models\Portfolio;
use App\Models\PortfolioImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function index()
    {
        return PortfolioResource::collection(Portfolio::with('images')->latest()->get());
    }

    public function show($slug)
    {
        $portfolio = Portfolio::with('images')->where('slug', $slug)->first();

        if (! $portfolio) {
            return response()->json(['message' => 'Portofolio tidak ditemukan'], 404);
        }

        return new PortfolioResource($portfolio);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:255',
            'full_detail' => 'required|string',
            'project_date' => 'required|date',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
        ]);

        $portfolio = Portfolio::create([
            'title' => $validated['title'],
            'slug' => Portfolio::generateSlug($validated['title']),
            'short_description' => $validated['short_description'],
            'full_detail' => $validated['full_detail'],
            'project_date' => $validated['project_date'],
        ]);

        $this->storeImages($request, $portfolio);

        return response()->json([
            'message' => 'Portofolio berhasil dibuat',
            'data' => new PortfolioResource($portfolio->load('images')),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $portfolio = Portfolio::with('images')->find($id);

        if (! $portfolio) {
            return response()->json(['message' => 'Portofolio tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'short_description' => 'sometimes|required|string|max:255',
            'full_detail' => 'sometimes|required|string',
            'project_date' => 'sometimes|required|date',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
            'deleted_image_ids' => 'nullable|array',
            'deleted_image_ids.*' => 'integer',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $portfolio->title) {
            $portfolio->slug = Portfolio::generateSlug($validated['title'], $portfolio->id);
        }

        $portfolio->fill(array_intersect_key(
            $validated,
            array_flip(['title', 'short_description', 'full_detail', 'project_date'])
        ))->save();

        // Hapus gambar yang dipilih admin dari galeri
        if (! empty($validated['deleted_image_ids'])) {
            $images = PortfolioImage::where('portfolio_id', $portfolio->id)
                ->whereIn('id', $validated['deleted_image_ids'])
                ->get();

            foreach ($images as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }
        }

        $this->storeImages($request, $portfolio);

        return response()->json([
            'message' => 'Portofolio berhasil diupdate',
            'data' => new PortfolioResource($portfolio->load('images')),
        ], 200);
    }

    public function destroy($id)
    {
        $portfolio = Portfolio::with('images')->find($id);

        if (! $portfolio) {
            return response()->json(['message' => 'Portofolio tidak ditemukan'], 404);
        }

        foreach ($portfolio->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $portfolio->delete();

        return response()->json(['message' => 'Portofolio berhasil dihapus'], 200);
    }

    /**
     * Simpan semua file dari field images[] ke storage dan tabel portfolio_images.
     */
    private function storeImages(Request $request, Portfolio $portfolio): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        foreach ($request->file('images') as $file) {
            $path = $file->store('portfolios', 'public');

            $portfolio->images()->create([
                'image_path' => $path,
            ]);
        }
    }
}
