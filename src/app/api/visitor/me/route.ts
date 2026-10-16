// ============================================
// GET /api/visitor/me
// جلب بيانات الزائر الحالي + إحصائياته
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVisitorSession } from "@/lib/visitor-auth";

export async function GET() {
  try {
    const session = await getVisitorSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const visitor = await prisma.visitorAccount.findUnique({
      where: { id: session.visitorId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        bio: true,
        website: true,
        avatar: true,
        emailVerified: true,
        isActive: true,
        isBanned: true,
        banReason: true,
        lastLoginAt: true,
        loginCount: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            inquiries: true,
          },
        },
      },
    });

    if (!visitor) {
      return NextResponse.json(
        { error: "الحساب غير موجود" },
        { status: 404 }
      );
    }

    if (visitor.isBanned) {
      return NextResponse.json(
        {
          error: "الحساب محظور",
          reason: visitor.banReason,
        },
        { status: 403 }
      );
    }

    if (!visitor.isActive) {
      return NextResponse.json(
        { error: "الحساب معطل" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      visitor: {
        id: visitor.id,
        fullName: visitor.fullName,
        email: visitor.email,
        phone: visitor.phone,
        bio: visitor.bio,
        website: visitor.website,
        avatar: visitor.avatar,
        emailVerified: visitor.emailVerified,
        lastLoginAt: visitor.lastLoginAt,
        loginCount: visitor.loginCount,
        createdAt: visitor.createdAt,
        stats: {
          comments: visitor._count.comments,
          likes: visitor._count.likes,
          inquiries: visitor._count.inquiries,
        },
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب البيانات" },
      { status: 500 }
    );
  }
}