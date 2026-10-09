// ============================================
// POST /api/auth/change-password
// تغيير كلمة مرور المستخدم الحالي
// ============================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findUser, verifyPassword, updatePassword } from "@/lib/users";

export async function POST(request: Request) {
  try {
    // التحقق من الجلسة
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // قراءة البيانات
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // التحقق
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "كلمة المرور الحالية والجديدة مطلوبتان" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // جلب المستخدم
    const user = await findUser(session.username);
    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // التحقق من كلمة المرور الحالية
    const isValid = verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "كلمة المرور الحالية غير صحيحة" },
        { status: 401 }
      );
    }

    // تحديث كلمة المرور
    const success = await updatePassword(user.id, newPassword);
    if (!success) {
      return NextResponse.json(
        { error: "فشل تحديث كلمة المرور" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}