<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFacilityRequest;
use App\Http\Requests\UpdateFacilityRequest;
use App\Models\Complaint;
use App\Models\Facility;
use App\Models\Inspection;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    /**
     * Return aggregated dashboard statistics and recent activities.
     *
     * GET /api/stats
     */
    public function stats(): JsonResponse
    {
        $totalFacilities = Facility::count();
        $totalInspections = Inspection::count();
        $totalComplaints = Complaint::count();
        $openComplaints = Complaint::where('status', 'open')->count();
        $inProgressComplaints = Complaint::where('status', 'in_progress')->count();
        $resolvedComplaints = Complaint::where('status', 'resolved')->count();
        $poorFacilities = Facility::whereIn('condition_rating', ['poor', 'critical'])->count();

        $recentInspections = Inspection::with(['facility:id,name,facility_code', 'inspector:id,name'])
            ->latest('inspection_date')
            ->limit(5)
            ->get();

        $recentComplaints = Complaint::with(['facility:id,name,facility_code', 'assignedTo:id,name'])
            ->latest('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'totals' => [
                    'facilities' => $totalFacilities,
                    'inspections' => $totalInspections,
                    'complaints' => $totalComplaints,
                    'open_complaints' => $openComplaints,
                    'in_progress_complaints' => $inProgressComplaints,
                    'resolved_complaints' => $resolvedComplaints,
                    'poor_facilities' => $poorFacilities,
                ],
                'recent_inspections' => $recentInspections,
                'recent_complaints' => $recentComplaints,
            ],
        ]);
    }

    /**
     * Return list of inspectors for assignment dropdowns.
     *
     * GET /api/inspectors
     */
    public function inspectors(): JsonResponse
    {
        $inspectors = User::select('id', 'name', 'email', 'role')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $inspectors,
        ]);
    }
    /**
     * Display a listing of facilities with search, filter, and pagination.
     *
     * GET /api/facilities
     */
    public function index(Request $request): JsonResponse
    {
        $query = Facility::query();

        if ($request->filled('type')) {
            $query->where('facility_type', $request->query('type'));
        }

        if ($request->filled('condition')) {
            $query->where('condition_rating', $request->query('condition'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('city')) {
            $query->where('city', 'ilike', '%' . $request->query('city') . '%');
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('facility_code', 'ilike', "%{$search}%")
                    ->orWhere('address', 'ilike', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $facilities = $query->withCount(['inspections', 'complaints'])
            ->orderBy('id', 'asc')
            ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $facilities->items(),
            'pagination' => [
                'current_page' => $facilities->currentPage(),
                'per_page' => $facilities->perPage(),
                'total' => $facilities->total(),
                'last_page' => $facilities->lastPage(),
            ],
        ]);
    }

    /**
     * Display the specified facility with inspection and complaint histories.
     *
     * GET /api/facilities/{id}
     */
    public function show(int|string $id): JsonResponse
    {
        $facility = Facility::with([
            'inspections' => fn ($q) => $q->with('inspector:id,name,email')->latest('inspection_date')->limit(5),
            'complaints' => fn ($q) => $q->with(['reporter:id,name', 'assignedTo:id,name'])->latest('created_at')->limit(5),
        ])->find($id);

        if (! $facility) {
            return response()->json([
                'status' => 'error',
                'message' => "Facility not found with ID {$id}",
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $facility,
        ]);
    }

    /**
     * Store a newly created facility.
     *
     * POST /api/facilities
     */
    public function store(StoreFacilityRequest $request): JsonResponse
    {
        $facility = Facility::create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Facility created successfully',
            'data' => $facility,
        ], 201);
    }

    /**
     * Update the specified facility.
     *
     * PUT/PATCH /api/facilities/{id}
     */
    public function update(UpdateFacilityRequest $request, int|string $id): JsonResponse
    {
        $facility = Facility::find($id);

        if (! $facility) {
            return response()->json([
                'status' => 'error',
                'message' => "Facility not found with ID {$id}",
            ], 404);
        }

        $facility->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Facility updated successfully',
            'data' => $facility,
        ]);
    }

    /**
     * Remove the specified facility.
     *
     * DELETE /api/facilities/{id}
     */
    public function destroy(int|string $id): JsonResponse
    {
        $facility = Facility::find($id);

        if (! $facility) {
            return response()->json([
                'status' => 'error',
                'message' => "Facility not found with ID {$id}",
            ], 404);
        }

        $facility->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Facility {$id} and associated inspection/complaint records deleted successfully",
        ]);
    }
}
