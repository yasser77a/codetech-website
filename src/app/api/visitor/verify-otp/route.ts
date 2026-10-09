// ============================================
// POST /api/visitor/verify-otp
// التحقق من OTP + تفعيل الحساب + إنشاء جلسة
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOtpCode, markOtpAsUsed } from "@/lib/otp";
import { createVisitorSession } from "@/lib/visitor-auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit({
      key: `verify:${ip}`,
      maxRequests: 10,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "تم تجاوز الحد المسموح، حاول بعد قليل" },
        { status: 429 }
      );
    }

    // 2. قراءة البيانات
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "البريد والرمز مطلوبان" },
        { status: 400 }
      );
    }

    // 3. التحقق من OTP
    const verification = await verifyOtpCode(
      email,
      code,
      "EMAIL_VERIFY"
    );

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error },
        { status: 400 }
      );
    }

    // 4. جلب الزائر
    const visitor = await prisma.visitorAccount.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!visitor) {
      return NextResponse.json(
        { error: "الحساب غير موجود" },
        { status: 404 }
      );
    }

    if (visitor.isBanned) {
      return NextResponse.json(
        { error: "الحساب محظور" },
        { status: 403 }
      );
    }

    // 5. تفعيل الحساب
    const updatedVisitor = await prisma.visitorAccount.update({
      where: { id: visitor.id },
      data: {
        emailVerified: true,
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    // 6. وضع علامة استخدام OTP
    if (verification.otpId) {
      await markOtpAsUsed(verification.otpId);
    }

    // 7. إنشاء جلسة
    await createVisitorSession({
      visitorId: updatedVisitor.id,
      email: updatedVisitor.email,
      fullName: updatedVisitor.fullName,
      role: "VISITOR",
    });

    // 8. تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        action: "VISITOR_VERIFIED",
        entityType: "VisitorAccount",
        entityId: visitor.id,
        details: `تفعيل حساب: ${email}`,
        ipAddress: ip,
      },
    });

    // 9. الرد
    return NextResponse.json({
      success: true,
      message: "تم تفعيل حسابك بنجاح",
      visitor: {
        id: updatedVisitor.id,
        fullName: updatedVisitor.fullName,
        email: updatedVisitor.email,
        avatar: updatedVisitor.avatar,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التحقق" },
      { status: 500 }
    );
  }
}