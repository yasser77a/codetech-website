// ============================================
// POST /api/visitor/logout
// تسجيل خروج الزائر
// ============================================

import { NextResponse } from "next/server";
import { destroyVisitorSession } from "@/lib/visitor-auth";

export async function POST() {
  try {
    await destroyVisitorSession();
    return NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "حدث خطأ" },
      { status: 500 }
    );
  }
}