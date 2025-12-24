import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export interface AuthTokenPayload {
  username: string;
  isAdmin: boolean;
}

/**
 * Verify JWT token from request cookies
 */
export function verifyAuthToken(request: NextRequest): AuthTokenPayload | null {
  try {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Create JWT token for admin
 */
export function createAuthToken(username: string): string {
  return jwt.sign(
    { username, isAdmin: true },
    JWT_SECRET,
    { expiresIn: "7d" } // Token expires in 7 days
  );
}

/**
 * Verify admin credentials
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  // In production, you might want to store credentials in database
  // For now, we'll use environment variables
  
  // Debug logging (remove in production)
  console.log("Verifying credentials:", {
    providedUsername: username,
    expectedUsername: ADMIN_USERNAME,
    usernameMatch: username === ADMIN_USERNAME,
    hasPassword: !!password,
    passwordLength: password.length,
    expectedPasswordLength: ADMIN_PASSWORD.length,
  });

  if (username !== ADMIN_USERNAME) {
    console.log("Username mismatch");
    return false;
  }

  // If ADMIN_PASSWORD is hashed, use bcrypt.compare
  // For now, we'll do simple comparison (you should hash passwords in production)
  // To hash a password: bcrypt.hashSync(password, 10)
  // To verify: bcrypt.compareSync(password, hashedPassword)

  // Check if password is already hashed (starts with $2a$ or $2b$)
  if (ADMIN_PASSWORD.startsWith("$2a$") || ADMIN_PASSWORD.startsWith("$2b$")) {
    const isValid = bcrypt.compareSync(password, ADMIN_PASSWORD);
    console.log("Using bcrypt comparison, result:", isValid);
    return isValid;
  }

  // Simple comparison for plain text password (for initial setup)
  const isValid = password === ADMIN_PASSWORD;
  console.log("Using plain text comparison, result:", isValid);
  return isValid;
}

/**
 * Hash password using bcrypt
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * Check if user is authenticated (middleware helper)
 */
export function isAuthenticated(request: NextRequest): boolean {
  const payload = verifyAuthToken(request);
  return payload !== null && payload.isAdmin === true;
}

/**
 * Create authenticated response with cookie
 */
export function createAuthenticatedResponse(
  token: string,
  redirectUrl: string = "/admin"
): NextResponse {
  const response = NextResponse.redirect(
    new URL(
      redirectUrl,
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    )
  );

  response.cookies.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}

/**
 * Create logout response (clears cookie)
 */
export function createLogoutResponse(
  redirectUrl: string = "/admin/login"
): NextResponse {
  const response = NextResponse.redirect(
    new URL(
      redirectUrl,
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    )
  );

  response.cookies.delete("admin-token");

  return response;
}
