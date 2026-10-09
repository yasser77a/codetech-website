// ============================================
// POST /api/auth/update-profile
// تحديث بيانات المستخدم الحالي
// ============================================

import { NextResponse } from "next/server";
import { getSession, createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // التحقق من الجلسة
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // قراءة البيانات
    const body = await request.json();
    const { fullName, email, avatar } = body;

    // التحقق
    if (fullName !== undefined && (!fullName || fullName.trim().length < 3)) {
      return NextResponse.json(
        { error: "الاسم الكامل يجب أن يكون 3 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // تحديث المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(fullName !== undefined && { fullName: fullName.trim() }),
        ...(email !== undefined && { email: email?.trim() || null }),
        ...(avatar !== undefined && { avatar: avatar || null }),
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    // تحديث الجلسة
    await createSession({
      userId: updatedUser.id,
      username: updatedUser.username,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث البيانات" },
      { status: 500 }
    );
  }
}