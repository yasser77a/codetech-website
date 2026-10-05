// ============================================
// GET  /api/users  - جلب المستخدمين
// POST /api/users  - إنشاء مستخدم جديد
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

// ============================================
// GET - جلب كل المستخدمين (للأدمن)
// ============================================
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المستخدمين" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - إنشاء مستخدم جديد
// ============================================
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح - يتطلب صلاحيات مدير" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // التحقق
    if (!body.username || !body.fullName || !body.password) {
      return NextResponse.json(
        { error: "اسم المستخدم والاسم الكامل وكلمة المرور مطلوبة" },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    const validRoles = ["ADMIN", "EDITOR", "VIEWER"];
    const role = body.role || "VIEWER";
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "الدور غير صحيح" },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود المستخدم
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: body.username.trim() },
          ...(body.email ? [{ email: body.email.trim() }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "اسم المستخدم أو البريد موجود مسبقاً" },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = bcrypt.hashSync(body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: body.username.trim(),
        fullName: body.fullName.trim(),
        email: body.email?.trim() || null,
        password: hashedPassword,
        role,
        isActive: body.isActive !== false,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "CREATE",
        entityType: "User",
        entityId: user.id,
        details: `إنشاء مستخدم: ${user.username}`,
      },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء المستخدم" },
      { status: 500 }
    );
  }
}