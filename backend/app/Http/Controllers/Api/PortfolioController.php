<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
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

    public function show($idOrSlug)
    {
        $portfolio = is_numeric($idOrSlug)
            ? Portfolio::with('images')->find($idOrSlug)
            : Portfolio::with('images')->where('slug', $idOrSlug)->first();

        if (! $portfolio) {
            return response()->json(['message' => 'Portofolio tidak ditemukan'], 404);
        }

        return new PortfolioResource($portfolio);
    }

    public function store(StorePortfolioRequest $request)
    {
        $validated = $request->validated();

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

    public function update(UpdatePortfolioRequest $request, $id)
    {
        $portfolio = Portfolio::with('images')->find($id);

        if (! $portfolio) {
            return response()->json(['message' => 'Portofolio tidak ditemukan'], 404);
        }

        $validated = $request->validated();

        if (isset($validated['title']) && $validated['title'] !== $portfolio->title) {
            $portfolio->slug = Portfolio::generateSlug($validated['title'], $portfolio->id);
        }

        $portfolio->fill(array_intersect_key(
            $validated,
            array_flip(['title', 'short_description', 'full_detail', 'project_date'])
        ))->save();

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
