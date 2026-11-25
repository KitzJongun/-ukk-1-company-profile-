<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
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

    public function show($idOrSlug)
    {
        $service = is_numeric($idOrSlug)
            ? Service::find($idOrSlug)
            : Service::where('slug', $idOrSlug)->first();

        if (! $service) {
            return response()->json(['message' => 'Layanan tidak ditemukan'], 404);
        }

        return new ServiceResource($service);
    }

    public function store(StoreServiceRequest $request)
    {
        $validated = $request->validated();

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

    public function update(UpdateServiceRequest $request, $id)
    {
        $service = Service::find($id);

        if (! $service) {
            return response()->json(['message' => 'Layanan tidak ditemukan'], 404);
        }

        $validated = $request->validated();

        if (isset($validated['title']) && $validated['title'] !== $service->title) {
            $service->slug = Service::generateSlug($validated['title'], $service->id);
            $service->title = $validated['title'];
        }

        if (isset($validated['short_description'])) {
            $service->short_description = $validated['short_description'];
        }

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
