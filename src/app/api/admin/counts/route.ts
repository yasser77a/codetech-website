// ============================================
// GET /api/admin/counts
// عدّادات الـ Badges في Sidebar
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const [
      inquiriesNew,
      notificationsUnread,
      reviewsPending,
      inquiriesTotal,
    ] = await Promise.all([
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.notification.count({ where: { isRead: false } }),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.inquiry.count(),
    ]);

    return NextResponse.json({
      inquiriesNew,
      notificationsUnread,
      reviewsPending,
      inquiriesTotal,
    });
  } catch (error) {
    console.error("GET /api/admin/counts error:", error);
    return NextResponse.json(
      { error: "حدث خطأ" },
      { status: 500 }
    );
  }
}