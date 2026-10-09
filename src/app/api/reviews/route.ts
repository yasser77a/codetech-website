// ============================================
// GET  /api/reviews  - جلب المراجعات (للأدمن)
// POST /api/reviews  - إنشاء مراجعة (للزوار)
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET - جلب كل المراجعات (للأدمن)
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status === "approved") where.isApproved = true;
    if (status === "pending") where.isApproved = false;
    if (status === "featured") where.isFeatured = true;
    if (status === "verified") where.isVerified = true;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المراجعات" },
      { status: 500 }
    );
  }
}

// POST - إنشاء مراجعة (من الزوار)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // التحقق
    if (!body.name || !body.content) {
      return NextResponse.json(
        { error: "الاسم والمحتوى مطلوبان" },
        { status: 400 }
      );
    }

    if (body.name.trim().length < 2) {
      return NextResponse.json(
        { error: "الاسم قصير جداً" },
        { status: 400 }
      );
    }

    if (body.content.trim().length < 10) {
      return NextResponse.json(
        { error: "المراجعة قصيرة جداً" },
        { status: 400 }
      );
    }

    const rating = parseInt(body.rating) || 5;
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "التقييم يجب أن يكون بين 1 و 5" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        name: body.name.trim(),
        email: body.email?.trim() || null,
        company: body.company?.trim() || null,
        position: body.position?.trim() || null,
        content: body.content.trim(),
        rating,
        isApproved: false, // يحتاج موافقة
        isVerified: false,
      },
    });

    // إنشاء إشعار للأدمن
    await prisma.notification.create({
      data: {
        title: "مراجعة جديدة",
        message: `${body.name} أضاف مراجعة جديدة`,
        type: "review",
        link: "/admin/reviews",
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إضافة المراجعة" },
      { status: 500 }
    );
  }
}