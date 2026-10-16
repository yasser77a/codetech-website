// ============================================
// POST /api/visitor/change-password
// تغيير كلمة مرور الزائر
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVisitorSession } from "@/lib/visitor-auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await getVisitorSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "كلمة المرور الحالية والجديدة مطلوبة" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // جلب الزائر
    const visitor = await prisma.visitorAccount.findUnique({
      where: { id: session.visitorId },
    });

    if (!visitor) {
      return NextResponse.json(
        { error: "الحساب غير موجود" },
        { status: 404 }
      );
    }

    // التحقق من كلمة المرور الحالية
    const valid = bcrypt.compareSync(currentPassword, visitor.password);
    if (!valid) {
      return NextResponse.json(
        { error: "كلمة المرور الحالية غير صحيحة" },
        { status: 401 }
      );
    }

    // تحديث كلمة المرور
    const hashed = bcrypt.hashSync(newPassword, 10);
    await prisma.visitorAccount.update({
      where: { id: visitor.id },
      data: { password: hashed },
    });

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        action: "VISITOR_CHANGE_PASSWORD",
        entityType: "VisitorAccount",
        entityId: visitor.id,
        details: `تغيير كلمة المرور: ${visitor.email}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم تغيير كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التغيير" },
      { status: 500 }
    );
  }
}