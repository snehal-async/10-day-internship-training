<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreComplaintRequest;
use App\Http\Requests\UpdateComplaintRequest;
use App\Models\Complaint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    /**
     * Display a listing of complaints with filtering and relationships.
     *
     * GET /api/complaints
     */
    public function index(Request $request): JsonResponse
    {
        $query = Complaint::with([
            'facility:id,name,facility_code',
            'reporter:id,name,email',
            'assignedTo:id,name,email',
        ]);

        if ($request->filled('facility_id')) {
            $query->where('facility_id', $request->query('facility_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('severity')) {
            $query->where('severity', $request->query('severity'));
        }

        if ($request->filled('assigned_to_id')) {
            $query->where('assigned_to_id', $request->query('assigned_to_id'));
        }

        if ($request->filled('reporter_id')) {
            $query->where('reporter_id', $request->query('reporter_id'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('ticket_number', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $complaints = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $complaints->items(),
            'pagination' => [
                'current_page' => $complaints->currentPage(),
                'per_page' => $complaints->perPage(),
                'total' => $complaints->total(),
                'last_page' => $complaints->lastPage(),
            ],
        ]);
    }

    /**
     * Display the specified complaint ticket.
     *
     * GET /api/complaints/{id}
     */
    public function show(int|string $id): JsonResponse
    {
        $complaint = Complaint::with([
            'facility:id,name,facility_code,address,city,condition_rating',
            'reporter:id,name,email',
            'assignedTo:id,name,email',
        ])->find($id);

        if (! $complaint) {
            return response()->json([
                'status' => 'error',
                'message' => "Complaint not found with ID {$id}",
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $complaint,
        ]);
    }

    /**
     * Store a newly created complaint ticket.
     *
     * POST /api/complaints
     */
    public function store(StoreComplaintRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Default reporter to authenticated user if not provided in payload
        if (empty($data['reporter_id']) && $request->user()) {
            $data['reporter_id'] = $request->user()->id;
        }

        $complaint = Complaint::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Complaint ticket created successfully',
            'data' => $complaint->load(['facility:id,name,facility_code', 'reporter:id,name', 'assignedTo:id,name']),
        ], 201);
    }

    /**
     * Update the specified complaint ticket.
     *
     * PUT/PATCH /api/complaints/{id}
     */
    public function update(UpdateComplaintRequest $request, int|string $id): JsonResponse
    {
        $complaint = Complaint::find($id);

        if (! $complaint) {
            return response()->json([
                'status' => 'error',
                'message' => "Complaint not found with ID {$id}",
            ], 404);
        }

        $data = $request->validated();

        // Auto-stamp resolved_at if status transitioning to resolved without manual timestamp
        if (isset($data['status']) && $data['status'] === 'resolved' && empty($data['resolved_at']) && ! $complaint->resolved_at) {
            $data['resolved_at'] = now();
        }

        $complaint->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Complaint updated successfully',
            'data' => $complaint->load(['facility:id,name,facility_code', 'reporter:id,name', 'assignedTo:id,name']),
        ]);
    }

    /**
     * Remove the specified complaint ticket.
     *
     * DELETE /api/complaints/{id}
     */
    public function destroy(int|string $id): JsonResponse
    {
        $complaint = Complaint::find($id);

        if (! $complaint) {
            return response()->json([
                'status' => 'error',
                'message' => "Complaint not found with ID {$id}",
            ], 404);
        }

        $complaint->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Complaint ticket {$id} deleted successfully",
        ]);
    }
}
