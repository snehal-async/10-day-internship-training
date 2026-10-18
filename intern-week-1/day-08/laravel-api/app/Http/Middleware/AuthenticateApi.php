<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApi
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization');

        if (! $header || ! str_starts_with($header, 'Bearer ')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated. Bearer token missing in Authorization header.',
            ], 401);
        }

        $plainToken = substr($header, 7);
        $hashedToken = hash('sha256', $plainToken);

        $tokenRecord = DB::table('personal_access_tokens')
            ->where('token', $hashedToken)
            ->first();

        if (! $tokenRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated. Invalid or expired API token.',
            ], 401);
        }

        $user = User::find($tokenRecord->tokenable_id);

        if (! $user || ! $user->is_active) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated. User account not found or suspended.',
            ], 401);
        }

        // Update token last used timestamp
        DB::table('personal_access_tokens')
            ->where('id', $tokenRecord->id)
            ->update(['last_used_at' => now()]);

        // Bind user to request
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
