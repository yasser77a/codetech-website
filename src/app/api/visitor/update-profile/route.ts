// ============================================
// PATCH /api/visitor/update-profile
// تحديث بيانات الزائر
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVisitorSession } from "@/lib/visitor-auth";

export async function PATCH(request: Request) {
  try {
    const session = await getVisitorSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, bio, website, avatar } = body;

    // التحقق
    if (fullName !== undefined && fullName.trim().length < 3) {
      return NextResponse.json(
        { error: "الاسم يجب أن يكون 3 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // التحقق من الجوال
    if (phone !== undefined) {
      const phoneClean = phone.replace(/[^\d+]/g, "");
      if (phoneClean.length < 8) {
        return NextResponse.json(
          { error: "رقم الجوال غير صحيح" },
          { status: 400 }
        );
      }

      // التحقق من عدم استخدام الجوال من زائر آخر
      const existing = await prisma.visitorAccount.findFirst({
        where: {
          phone: phoneClean,
          id: { not: session.visitorId },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "رقم الجوال مستخدم من حساب آخر" },
          { status: 400 }
        );
      }
    }

    // تحديث
    const visitor = await prisma.visitorAccount.update({
      where: { id: session.visitorId },
      data: {
        ...(fullName !== undefined && { fullName: fullName.trim() }),
        ...(phone !== undefined && { phone: phone.replace(/[^\d+]/g, "") }),
        ...(bio !== undefined && { bio: bio?.trim() || null }),
        ...(website !== undefined && { website: website?.trim() || null }),
        ...(avatar !== undefined && { avatar: avatar || null }),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        bio: true,
        website: true,
        avatar: true,
      },
    });

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        action: "VISITOR_UPDATE_PROFILE",
        entityType: "VisitorAccount",
        entityId: visitor.id,
        details: `تحديث ملف: ${visitor.fullName}`,
      },
    });

    return NextResponse.json({ success: true, visitor });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التحديث" },
      { status: 500 }
    );
  }
}