// ============================================
// GET    /api/users/[id]  - جلب مستخدم
// PATCH  /api/users/[id]  - تعديل
// DELETE /api/users/[id]  - حذف
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح - يتطلب صلاحيات مدير" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const updateData: any = {};

    if (body.fullName) updateData.fullName = body.fullName.trim();
    if (body.email !== undefined) updateData.email = body.email?.trim() || null;
    if (body.role) updateData.role = body.role;
    if (body.avatar !== undefined) updateData.avatar = body.avatar || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json(
          { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
          { status: 400 }
        );
      }
      updateData.password = bcrypt.hashSync(body.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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
        action: "UPDATE",
        entityType: "User",
        entityId: user.id,
        details: `تعديل مستخدم: ${user.username}`,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التعديل" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح - يتطلب صلاحيات مدير" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // منع حذف النفس
    if (session.userId === id) {
      return NextResponse.json(
        { error: "لا يمكنك حذف حسابك الخاص" },
        { status: 400 }
      );
    }

    // التحقق من آخر أدمن
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "لا يمكن حذف آخر مدير في النظام" },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "DELETE",
        entityType: "User",
        entityId: id,
        details: "حذف مستخدم",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الحذف" },
      { status: 500 }
    );
  }
}