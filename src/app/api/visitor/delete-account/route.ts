// ============================================
// DELETE /api/visitor/delete-account
// حذف حساب الزائر
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVisitorSession, destroyVisitorSession } from "@/lib/visitor-auth";
import bcrypt from "bcryptjs";

export async function DELETE(request: Request) {
  try {
    const session = await getVisitorSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "كلمة المرور مطلوبة للتأكيد" },
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

    // التحقق من كلمة المرور
    const valid = bcrypt.compareSync(password, visitor.password);
    if (!valid) {
      return NextResponse.json(
        { error: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // حذف الحساب
    await prisma.visitorAccount.delete({
      where: { id: visitor.id },
    });

    // حذف الجلسة
    await destroyVisitorSession();

    return NextResponse.json({
      success: true,
      message: "تم حذف الحساب بنجاح",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الحذف" },
      { status: 500 }
    );
  }
}