// ============================================
// GET /api/admin/comments
// جلب التعليقات للأدمن (كل التعليقات + إحصائيات)
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const targetType = searchParams.get("targetType");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (targetType && targetType !== "all") {
      where.targetType = targetType.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // جلب التعليقات الرئيسية فقط
    where.parentId = null;

    const [comments, stats] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          replies: {
            orderBy: { createdAt: "asc" },
          },
          repliedBy: {
            select: { id: true, fullName: true, avatar: true },
          },
          project: {
            select: { id: true, title: true, slug: true },
          },
          blogPost: {
            select: { id: true, title: true, slug: true },
          },
        },
      }),
      // الإحصائيات
      Promise.all([
        prisma.comment.count(),
        prisma.comment.count({ where: { status: "PENDING" } }),
        prisma.comment.count({ where: { status: "APPROVED" } }),
        prisma.comment.count({ where: { status: "REJECTED" } }),
        prisma.comment.count({ where: { status: "SPAM" } }),
      ]),
    ]);

    const [total, pending, approved, rejected, spam] = stats;

    return NextResponse.json({
      comments,
      stats: { total, pending, approved, rejected, spam },
    });
  } catch (error) {
    console.error("GET /api/admin/comments error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب التعليقات" },
      { status: 500 }
    );
  }
}