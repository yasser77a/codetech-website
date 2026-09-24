import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "codetech-super-secret-key-change-in-production-2026"
);

// ✅ إضافة index signature لحل الخطأ
export interface SessionPayload {
  userId: string;
  username: string;
  fullName: string;
  role: string;
  [key: string]: unknown;
}

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
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

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

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("codetech_session");
}