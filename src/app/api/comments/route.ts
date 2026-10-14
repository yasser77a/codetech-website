// ============================================
// GET  /api/comments  - جلب التعليقات (عام + للعنصر)
// POST /api/comments  - إضافة تعليق جديد
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getVisitorSession } from "@/lib/visitor-auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

// ============================================
// GET - جلب التعليقات
// ============================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("targetType"); // GENERAL | PROJECT | BLOG_POST
    const targetId = searchParams.get("targetId");
    const status = searchParams.get("status"); // للـ admin فقط

    const where: any = {};

    // تصفية حسب النوع والعنصر
    if (targetType) {
      where.targetType = targetType;
    }
    if (targetId) {
      where.targetId = targetId;
    }

    // الزائر العادي يرى الموافق عليها فقط
    // الأدمن يرى الجميع
    const session = await getSession();
    const isAdmin = !!session;

    if (isAdmin && status) {
      where.status = status;
    } else {
      where.status = "APPROVED"; // الزوار يرون الموافق عليها فقط
    }

    // جلب التعليقات الرئيسية فقط (بدون ردود، ثم الردود منفصلة)
    where.parentId = null;

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        replies: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "asc" },
        },
        repliedBy: {
          select: { id: true, fullName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب التعليقات" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - إضافة تعليق جديد
// ============================================
export async function POST(request: Request) {
  try {
    // Rate Limiting
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit({
      key: `comment:${ip}`,
      maxRequests: RATE_LIMITS.COMMENT.maxRequests,
      windowMs: RATE_LIMITS.COMMENT.windowMs,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "تم تجاوز الحد المسموح، حاول بعد قليل" },
        { status: 429 }
      );
    }

    // التحقق من الجلسة (اختياري - يمكن للضيف التعليق)
    const visitorSession = await getVisitorSession();

    const body = await request.json();

    // التحقق
    if (!body.name || !body.email || !body.content) {
      return NextResponse.json(
        { error: "الاسم والبريد والتعليق مطلوبة" },
        { status: 400 }
      );
    }

    if (body.name.trim().length < 2) {
      return NextResponse.json(
        { error: "الاسم قصير جداً" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صحيح" },
        { status: 400 }
      );
    }

    if (body.content.trim().length < 5) {
      return NextResponse.json(
        { error: "التعليق قصير جداً" },
        { status: 400 }
      );
    }

    if (body.content.trim().length > 2000) {
      return NextResponse.json(
        { error: "التعليق طويل جداً (الحد 2000 حرف)" },
        { status: 400 }
      );
    }

    // تحديد targetType و targetId
    const targetType = body.targetType || "GENERAL";
    const targetId = body.targetId || null;

    // التحقق من وجود العنصر المستهدف
    if (targetType === "PROJECT" && targetId) {
      const project = await prisma.project.findUnique({
        where: { id: targetId },
      });
      if (!project) {
        return NextResponse.json(
          { error: "المشروع غير موجود" },
          { status: 404 }
        );
      }
    } else if (targetType === "BLOG_POST" && targetId) {
      const post = await prisma.blogPost.findUnique({
        where: { id: targetId },
      });
      if (!post) {
        return NextResponse.json(
          { error: "المنشور غير موجود" },
          { status: 404 }
        );
      }
    }

    // إنشاء التعليق
    const comment = await prisma.comment.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        content: body.content.trim(),
        targetType,
        targetId,
        status: "PENDING", // يحتاج موافقة
        visitorId: visitorSession?.visitorId || null,
        projectId: targetType === "PROJECT" ? targetId : null,
        blogPostId: targetType === "BLOG_POST" ? targetId : null,
        parentId: body.parentId || null,
      },
    });
    
    if (targetType === "PROJECT" && targetId) {
        await prisma.project.update({
            where: { id: targetId },
            data: { commentsCount: { increment: 1 } },
        });
    } else if (targetType === "BLOG_POST" && targetId) {
        await prisma.blogPost.update({
            where: { id: targetId },
            data: { commentsCount: { increment: 1 } },
        });
    }

    // إنشاء إشعار للأدمن
    await prisma.notification.create({
      data: {
        title: "تعليق جديد",
        message: `${body.name} أضاف تعليقاً جديداً`,
        type: "comment",
        link: "/admin/comments",
      },
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إضافة التعليق" },
      { status: 500 }
    );
  }
}