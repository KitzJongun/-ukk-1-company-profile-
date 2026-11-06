<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index() { return response()->json(Portfolio::all(), 200); }
    public function show($slug) { return response()->json(Portfolio::where('slug', $slug)->first(), 200); }
    public function store(Request $request) { $p = Portfolio::create($request->all()); return response()->json($p, 201); }
    public function update(Request $request, $id) { $p = Portfolio::find($id); $p->update($request->all()); return response()->json($p, 200); }
    public function destroy($id) { Portfolio::destroy($id); return response()->json(null, 204); }
}