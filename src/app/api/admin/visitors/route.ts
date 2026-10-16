// ============================================
// GET /api/admin/visitors
// جلب قائمة الزوار (للأدمن)
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
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    if (status === "active") where.isActive = true;
    if (status === "inactive") where.isActive = false;
    if (status === "banned") where.isBanned = true;
    if (status === "verified") where.emailVerified = true;
    if (status === "unverified") where.emailVerified = false;

    const [visitors, stats] = await Promise.all([
      prisma.visitorAccount.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
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
      }),
      Promise.all([
        prisma.visitorAccount.count(),
        prisma.visitorAccount.count({ where: { isActive: true } }),
        prisma.visitorAccount.count({ where: { isBanned: true } }),
        prisma.visitorAccount.count({ where: { emailVerified: false } }),
        prisma.visitorAccount.count({ where: { isActive: false } }),
      ]),
    ]);

    const [total, active, banned, unverified, inactive] = stats;

    return NextResponse.json({
      visitors,
      stats: { total, active, banned, unverified, inactive },
    });
  } catch (error) {
    console.error("GET /api/admin/visitors error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الزوار" },
      { status: 500 }
    );
  }
}