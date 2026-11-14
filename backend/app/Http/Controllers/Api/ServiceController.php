<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function index()
    {
        return ServiceResource::collection(Service::latest()->get());
    }

    public function show($slug)
    {
        $service = Service::where('slug', $slug)->first();

        if (! $service) {
            return response()->json(['message' => 'Layanan tidak ditemukan'], 404);
        }

        return new ServiceResource($service);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:255',
            'icon' => 'nullable|image|max:5120',
        ]);

        $service = Service::create([
            'title' => $validated['title'],
            'slug' => Service::generateSlug($validated['title']),
            'short_description' => $validated['short_description'],
            'icon' => $request->hasFile('icon')
                ? $request->file('icon')->store('services', 'public')
                : null,
        ]);

        return response()->json([
            'message' => 'Layanan berhasil dibuat',
            'data' => new ServiceResource($service),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (! $service) {
            return response()->json(['message' => 'Layanan tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'short_description' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|image|max:5120',
            'remove_icon' => 'sometimes|boolean',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $service->title) {
            $service->slug = Service::generateSlug($validated['title'], $service->id);
        }

        $service->fill(array_intersect_key(
            $validated,
            array_flip(['title', 'short_description'])
        ));

        if ($request->hasFile('icon')) {
            if ($service->icon) {
                Storage::disk('public')->delete($service->icon);
            }
            $service->icon = $request->file('icon')->store('services', 'public');
        } elseif ($request->boolean('remove_icon') && $service->icon) {
            Storage::disk('public')->delete($service->icon);
            $service->icon = null;
        }

        $service->save();

        return response()->json([
            'message' => 'Layanan berhasil diupdate',
            'data' => new ServiceResource($service),
        ], 200);
    }

    public function destroy($id)
    {
        $service = Service::find($id);

        if (! $service) {
            return response()->json(['message' => 'Layanan tidak ditemukan'], 404);
        }

        if ($service->icon) {
            Storage::disk('public')->delete($service->icon);
        }

        $service->delete();

        return response()->json(['message' => 'Layanan berhasil dihapus'], 200);
    }
}
