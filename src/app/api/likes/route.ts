// ============================================
// POST /api/likes  - إعجاب/إلغاء إعجاب
// GET  /api/likes  - عدد الإعجابات + حالة الزائر
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { getVisitorSession } from "@/lib/visitor-auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { randomUUID } from "crypto";

// ============================================
// GET - حالة الإعجاب + العدد
// ============================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: "targetType و targetId مطلوبان" },
        { status: 400 }
      );
    }

    // عدد الإعجابات
    const likesCount = await prisma.like.count({
      where: { targetType, targetId },
    });

    // هل أعجب الزائر؟
    const cookieStore = await cookies();
    const visitorId = cookieStore.get("visitor_id")?.value;
    const visitorSession = await getVisitorSession();

    let userLiked = false;

    if (visitorSession) {
      const existing = await prisma.like.findFirst({
        where: {
          userId: visitorSession.visitorId,
          targetType,
          targetId,
        },
      });
      userLiked = !!existing;
    } else if (visitorId) {
      const existing = await prisma.like.findFirst({
        where: {
          visitorId,
          targetType,
          targetId,
        },
      });
      userLiked = !!existing;
    }

    return NextResponse.json({ likesCount, userLiked });
  } catch (error) {
    console.error("GET /api/likes error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الإعجابات" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - إعجاب / إلغاء إعجاب
// ============================================
export async function POST(request: Request) {
  try {
    // Rate Limiting
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit({
      key: `like:${ip}`,
      maxRequests: RATE_LIMITS.LIKE.maxRequests,
      windowMs: RATE_LIMITS.LIKE.windowMs,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "تم تجاوز الحد المسموح" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { targetType, targetId } = body;

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: "بيانات ناقصة" },
        { status: 400 }
      );
    }

    // تحديد هوية الزائر
    const visitorSession = await getVisitorSession();

    let identifier: { visitorId?: string; userId?: string } = {};

    if (visitorSession) {
      // زائر مسجل
      identifier.userId = visitorSession.visitorId;
    } else {
      // زائر ضيف - استخدام Cookie
      const cookieStore = await cookies();
      let visitorId = cookieStore.get("visitor_id")?.value;

      if (!visitorId) {
        visitorId = randomUUID();
        cookieStore.set("visitor_id", visitorId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365, // سنة
          path: "/",
        });
      }

      identifier.visitorId = visitorId;
    }

    // هل يوجد إعجاب مسبق؟
    const existing = await prisma.like.findFirst({
      where: {
        ...identifier,
        targetType,
        targetId,
      },
    });

    if (existing) {
      // إلغاء الإعجاب
      await prisma.like.delete({ where: { id: existing.id } });

      // تقليل العداد في العنصر
      if (targetType === "PROJECT") {
        await prisma.project.update({
          where: { id: targetId },
          data: { likesCount: { decrement: 1 } },
        });
      } else if (targetType === "BLOG_POST") {
        await prisma.blogPost.update({
          where: { id: targetId },
          data: { likesCount: { decrement: 1 } },
        });
      }

      const likesCount = await prisma.like.count({
        where: { targetType, targetId },
      });

      return NextResponse.json({ success: true, liked: false, likesCount });
    } else {
      // إضافة إعجاب
      await prisma.like.create({
        data: {
          ...identifier,
          targetType,
          targetId,
          ipAddress: ip !== "unknown" ? ip : null,
        },
      });

      // زيادة العداد في العنصر
      if (targetType === "PROJECT") {
        await prisma.project.update({
          where: { id: targetId },
          data: { likesCount: { increment: 1 } },
        });
      } else if (targetType === "BLOG_POST") {
        await prisma.blogPost.update({
          where: { id: targetId },
          data: { likesCount: { increment: 1 } },
        });
      }

      const likesCount = await prisma.like.count({
        where: { targetType, targetId },
      });

      return NextResponse.json({ success: true, liked: true, likesCount });
    }
  } catch (error) {
    console.error("POST /api/likes error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الإعجاب" },
      { status: 500 }
    );
  }
}