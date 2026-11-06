<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::all(), 200);
    }

    public function store(Request $request)
    {
        // Validasi dasar
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $data = $request->all();

        // Kalau ada file gambar yang diupload
        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('services', 'public');
            $data['icon_url'] = $path;
        }

        $service = Service::create($data);
        return response()->json(['message' => 'Layanan dibuat', 'data' => $service], 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) return response()->json(['message' => 'Tidak ditemukan'], 404);

        $data = $request->all();

        if ($request->hasFile('icon')) {
            if ($service->icon_url) Storage::disk('public')->delete($service->icon_url);
            $path = $request->file('icon')->store('services', 'public');
            $data['icon_url'] = $path;
        }

        $service->update($data);
        return response()->json(['message' => 'Layanan diupdate', 'data' => $service], 200);
    }

    public function destroy($id)
    {
        $service = Service::find($id);
        if (!$service) return response()->json(['message' => 'Tidak ditemukan'], 404);

        if ($service->icon_url) Storage::disk('public')->delete($service->icon_url);
        $service->delete();
        return response()->json(['message' => 'Layanan dihapus'], 200);
    }
}