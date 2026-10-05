// ============================================
// GET /api/admin/recent
// البيانات الحديثة للوحة التحكم
// ============================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getRecentInquiries,
  getRecentActivity,
  getTopProjects,
} from "@/lib/stats";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    // جلب البيانات بالتوازي
    const [inquiries, activity, topProjects] = await Promise.all([
      getRecentInquiries(5),
      getRecentActivity(10),
      getTopProjects(5),
    ]);

    return NextResponse.json({
      inquiries,
      activity,
      topProjects,
    });
  } catch (error) {
    console.error("Recent API error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب البيانات" },
      { status: 500 }
    );
  }
}