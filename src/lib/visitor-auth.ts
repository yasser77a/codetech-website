// ============================================
// CodeTech Website - Visitor Auth (JWT)
// ============================================
// منفصل تماماً عن JWT الأدمن (auth.ts)
// ============================================

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ⚠️ مفتاح JWT منفصل للزوار
const VISITOR_JWT_SECRET = process.env.VISITOR_JWT_SECRET;
const JWT_SECRET_VALUE = process.env.JWT_SECRET;

if (!JWT_SECRET_VALUE) {
  console.error(
    "❌ CRITICAL: JWT_SECRET is not set in environment variables!"
  );
}

// نستخدم JWT_SECRET مع لاحقة للزوار
const SECRET = new TextEncoder().encode(
  (JWT_SECRET_VALUE || "TEMP_FALLBACK") + "-VISITOR"
);

// ============================================
// Types
// ============================================
export interface VisitorSessionPayload {
  visitorId: string;
  email: string;
  fullName: string;
  role: "VISITOR";
  [key: string]: unknown;
}

// ============================================
// Create visitor session cookie
// ============================================
export async function createVisitorSession(payload: VisitorSessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set("codetech_visitor", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return token;
}

// ============================================
// Get current visitor session
// ============================================
export async function getVisitorSession(): Promise<VisitorSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("codetech_visitor")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    return {
      visitorId: payload.visitorId as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      role: "VISITOR",
    };
  } catch {
    return null;
  }
}

// ============================================
// Destroy visitor session
// ============================================
export async function destroyVisitorSession() {
  const cookieStore = await cookies();
  cookieStore.delete("codetech_visitor");
}

// ============================================
// Require visitor (for API routes)
// ============================================
export async function requireVisitor(): Promise<VisitorSessionPayload | null> {
  return await getVisitorSession();
}