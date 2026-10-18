<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInspectionRequest;
use App\Http\Requests\UpdateInspectionRequest;
use App\Models\Inspection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InspectionController extends Controller
{
    /**
     * Display a listing of inspections with filtering and relationships.
     *
     * GET /api/inspections
     */
    public function index(Request $request): JsonResponse
    {
        $query = Inspection::with([
            'facility:id,name,facility_code,condition_rating',
            'inspector:id,name,email,role',
        ]);

        if ($request->filled('facility_id')) {
            $query->where('facility_id', $request->query('facility_id'));
        }

        if ($request->filled('result')) {
            $query->where('result', $request->query('result'));
        }

        if ($request->filled('inspector_id')) {
            $query->where('inspector_id', $request->query('inspector_id'));
        }

        if ($request->filled('min_score')) {
            $query->where('score', '>=', (int) $request->query('min_score'));
        }

        if ($request->filled('follow_up_required')) {
            $query->where('follow_up_required', filter_var($request->query('follow_up_required'), FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $inspections = $query->orderBy('inspection_date', 'desc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $inspections->items(),
            'pagination' => [
                'current_page' => $inspections->currentPage(),
                'per_page' => $inspections->perPage(),
                'total' => $inspections->total(),
                'last_page' => $inspections->lastPage(),
            ],
        ]);
    }

    /**
     * Display the specified inspection.
     *
     * GET /api/inspections/{id}
     */
    public function show(int|string $id): JsonResponse
    {
        $inspection = Inspection::with([
            'facility:id,name,facility_code,condition_rating,address,city',
            'inspector:id,name,email,role',
        ])->find($id);

        if (! $inspection) {
            return response()->json([
                'status' => 'error',
                'message' => "Inspection not found with ID {$id}",
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $inspection,
        ]);
    }

    /**
     * Store a newly created inspection.
     *
     * POST /api/inspections
     */
    public function store(StoreInspectionRequest $request): JsonResponse
    {
        $inspection = Inspection::create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Inspection logged successfully',
            'data' => $inspection->load(['facility:id,name,facility_code', 'inspector:id,name,email']),
        ], 201);
    }

    /**
     * Update the specified inspection.
     *
     * PUT/PATCH /api/inspections/{id}
     */
    public function update(UpdateInspectionRequest $request, int|string $id): JsonResponse
    {
        $inspection = Inspection::find($id);

        if (! $inspection) {
            return response()->json([
                'status' => 'error',
                'message' => "Inspection not found with ID {$id}",
            ], 404);
        }

        $inspection->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Inspection updated successfully',
            'data' => $inspection->load(['facility:id,name,facility_code', 'inspector:id,name,email']),
        ]);
    }

    /**
     * Remove the specified inspection.
     *
     * DELETE /api/inspections/{id}
     */
    public function destroy(int|string $id): JsonResponse
    {
        $inspection = Inspection::find($id);

        if (! $inspection) {
            return response()->json([
                'status' => 'error',
                'message' => "Inspection not found with ID {$id}",
            ], 404);
        }

        $inspection->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Inspection {$id} deleted successfully",
        ]);
    }
}
