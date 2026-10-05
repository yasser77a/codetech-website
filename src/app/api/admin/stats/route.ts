// ============================================
// GET /api/admin/stats
// إحصائيات لوحة التحكم
// ============================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/stats";

export async function GET() {
  try {
    // التحقق من الجلسة
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    // جلب الإحصائيات
    const stats = await getDashboardStats();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الإحصائيات" },
      { status: 500 }
    );
  }
}