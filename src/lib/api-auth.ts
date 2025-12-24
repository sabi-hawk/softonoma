import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "./auth";

/**
 * Middleware helper to protect API routes
 * Returns null if authenticated, or an error response if not
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  const payload = verifyAuthToken(request);

  if (!payload || !payload.isAdmin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  return null;
}

