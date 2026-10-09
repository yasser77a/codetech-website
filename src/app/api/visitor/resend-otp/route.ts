// ============================================
// POST /api/visitor/resend-otp
// إعادة إرسال OTP
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createOtpCode } from "@/lib/otp";
import { sendEmail, renderOtpEmailTemplate } from "@/lib/email";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit({
      key: `resend-otp:${ip}`,
      maxRequests: RATE_LIMITS.SEND_OTP.maxRequests,
      windowMs: RATE_LIMITS.SEND_OTP.windowMs,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "تم تجاوز الحد المسموح، حاول بعد قليل",
          retryAfter: rateCheck.resetAt.toISOString(),
        },
        { status: 429 }
      );
    }

    // 2. قراءة البيانات
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب" },
        { status: 400 }
      );
    }

    // 3. جلب الزائر
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

    if (visitor.emailVerified) {
      return NextResponse.json(
        { error: "الحساب مُفعَّل مسبقاً" },
        { status: 400 }
      );
    }

    // 4. إنشاء OTP جديد
    const { code, expiresAt } = await createOtpCode(
      email,
      "EMAIL_VERIFY",
      visitor.id
    );

    // 5. إرسال
    const { subject, html, text } = renderOtpEmailTemplate(
      code,
      visitor.fullName
    );

    const emailResult = await sendEmail(
      { to: email, subject, html, text },
      code
    );

    return NextResponse.json({
      success: true,
      message: "تم إعادة إرسال الرمز",
      emailMode: emailResult.mode,
      displayedCode: emailResult.displayedCode,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "حدث خطأ" },
      { status: 500 }
    );
  }
}