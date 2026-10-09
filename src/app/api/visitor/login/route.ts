// ============================================
// POST /api/visitor/login
// تسجيل دخول الزائر
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createVisitorSession } from "@/lib/visitor-auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit({
      key: `login:${ip}`,
      maxRequests: RATE_LIMITS.LOGIN.maxRequests,
      windowMs: RATE_LIMITS.LOGIN.windowMs,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "تم تجاوز الحد المسموح، حاول بعد قليل" },
        { status: 429 }
      );
    }

    // 2. قراءة البيانات
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    // 3. جلب الزائر
    const visitor = await prisma.visitorAccount.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!visitor) {
      return NextResponse.json(
        { error: "البريد أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    if (visitor.isBanned) {
      return NextResponse.json(
        {
          error: `الحساب محظور${visitor.banReason ? `: ${visitor.banReason}` : ""}`,
        },
        { status: 403 }
      );
    }

    if (!visitor.emailVerified) {
      return NextResponse.json(
        {
          error: "الحساب غير مُفعَّل، يرجى التحقق من بريدك",
          needsVerification: true,
          email: visitor.email,
        },
        { status: 403 }
      );
    }

    // 4. التحقق من كلمة المرور
    const validPassword = bcrypt.compareSync(password, visitor.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "البريد أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // 5. تحديث آخر تسجيل دخول
    const updatedVisitor = await prisma.visitorAccount.update({
      where: { id: visitor.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    // 6. إنشاء جلسة
    await createVisitorSession({
      visitorId: updatedVisitor.id,
      email: updatedVisitor.email,
      fullName: updatedVisitor.fullName,
      role: "VISITOR",
    });

    // 7. تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        action: "VISITOR_LOGIN",
        entityType: "VisitorAccount",
        entityId: visitor.id,
        details: `تسجيل دخول: ${email}`,
        ipAddress: ip,
      },
    });

    // 8. الرد
    return NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول",
      visitor: {
        id: updatedVisitor.id,
        fullName: updatedVisitor.fullName,
        email: updatedVisitor.email,
        avatar: updatedVisitor.avatar,
      },
    });
  } catch (error) {
    console.error("Visitor login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تسجيل الدخول" },
      { status: 500 }
    );
  }
}