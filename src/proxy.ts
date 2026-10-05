// ============================================
// CodeTech Website - Proxy (Middleware)
// حماية /admin
// ============================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ✅ يقرأ نفس المفتاح الذي يوقّع به auth.ts
const JWT_SECRET_VALUE = process.env.JWT_SECRET;

if (!JWT_SECRET_VALUE) {
  console.error(
    "❌ CRITICAL: JWT_SECRET is not set!\n" +
    "Proxy will not work correctly without it."
  );
}

const SECRET = new TextEncoder().encode(
  JWT_SECRET_VALUE || "TEMP_FALLBACK_DO_NOT_USE_IN_PRODUCTION"
);

// ✅ في Next.js 16، الدالة اسمها proxy بدلاً من middleware
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // حماية /admin
  // ============================================
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("codetech_session")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error("Proxy JWT verify error:", error);
      // Token غير صالح → احذفه ووجهه للـ login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("codetech_session");
      return response;
    }
  }

  // ============================================
  // إذا كان مسجلاً ودخل /login → وجهه للأدمن
  // ============================================
  if (pathname === "/login") {
    const token = request.cookies.get("codetech_session")?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } catch {
        // Token غير صالح، اتركه يرى login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};