import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "codetech-super-secret-key-change-in-production-2026"
);

// ✅ في Next.js 16، الدالة اسمها proxy بدلاً من middleware
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // حماية /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("codetech_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // إذا كان مسجلاً ودخل /login → توجيهه للأدمن
  if (pathname === "/login") {
    const token = request.cookies.get("codetech_session")?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } catch {
        // متابعة عادي
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};