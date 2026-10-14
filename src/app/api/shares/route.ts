// ============================================
// POST /api/shares  - زيادة عداد المشاركات
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate Limiting
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit({
      key: `share:${ip}`,
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 100 في الساعة
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "تم تجاوز الحد المسموح" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { targetType, targetId, platform } = body;

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: "بيانات ناقصة" },
        { status: 400 }
      );
    }

    // زيادة العداد
    if (targetType === "PROJECT") {
      await prisma.project.update({
        where: { id: targetId },
        data: { sharesCount: { increment: 1 } },
      });
    } else if (targetType === "BLOG_POST") {
      await prisma.blogPost.update({
        where: { id: targetId },
        data: { sharesCount: { increment: 1 } },
      });
    } else {
      return NextResponse.json(
        { error: "نوع غير صحيح" },
        { status: 400 }
      );
    }

    // تسجيل النشاط (اختياري)
    await prisma.activityLog.create({
      data: {
        action: "SHARE",
        entityType: targetType,
        entityId: targetId,
        details: `مشاركة عبر ${platform || "غير محدد"}`,
        ipAddress: ip !== "unknown" ? ip : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/shares error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تسجيل المشاركة" },
      { status: 500 }
    );
  }
}