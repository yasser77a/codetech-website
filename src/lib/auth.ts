// ============================================
// CodeTech Website - JWT Auth (jose)
// ============================================

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ⚠️ JWT_SECRET يجب أن يكون موجوداً في .env.local
const JWT_SECRET_VALUE = process.env.JWT_SECRET;

if (!JWT_SECRET_VALUE) {
  console.error(
    "❌ CRITICAL: JWT_SECRET is not set in environment variables!\n" +
    "Please add it to .env.local and .env"
  );
}

const SECRET = new TextEncoder().encode(
  JWT_SECRET_VALUE || "TEMP_FALLBACK_DO_NOT_USE_IN_PRODUCTION"
);

// ============================================
// Types
// ============================================
export interface SessionPayload {
  userId: string;
  username: string;
  fullName: string;
  role: string;
  [key: string]: unknown;
}

// ============================================
// Create session cookie
// ============================================
export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set("codetech_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// ============================================
// Get current session
// ============================================
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("codetech_session")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    return {
      userId: payload.userId as string,
      username: payload.username as string,
      fullName: payload.fullName as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

// ============================================
// Destroy session
// ============================================
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("codetech_session");
}

// ============================================
// Require authentication (for API routes)
// ============================================
export async function requireAuth(): Promise<SessionPayload | null> {
  return await getSession();
}

// ============================================
// Require admin role
// ============================================
export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}