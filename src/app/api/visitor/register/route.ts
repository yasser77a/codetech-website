// ============================================
// POST /api/visitor/register
// تسجيل زائر جديد + إرسال OTP
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createOtpCode } from "@/lib/otp";
import { sendEmail, renderOtpEmailTemplate } from "@/lib/email";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

// التحقق من البريد
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit({
      key: `register:${ip}`,
      maxRequests: RATE_LIMITS.REGISTER.maxRequests,
      windowMs: RATE_LIMITS.REGISTER.windowMs,
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
    const { fullName, email, phone, password, bio, website } = body;

    // 3. التحقق
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "الاسم والبريد والجوال وكلمة المرور مطلوبة" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صحيح" },
        { status: 400 }
      );
    }

    // ✅ التحقق من الجوال
    const phoneClean = phone.replace(/[^\d+]/g, "");
    if (phoneClean.length < 8) {
      return NextResponse.json(
        { error: "رقم الجوال غير صحيح" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
        { status: 400 }
      );
    }

    if (fullName.trim().length < 3) {
      return NextResponse.json(
        { error: "الاسم يجب أن يكون 3 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // 4. التحقق من عدم وجود الحساب
    const existing = await prisma.visitorAccount.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { phone: phoneClean },
        ],
      },
    });

    if (existing) {
      // إذا كان الحساب موجوداً لكنه غير مُفعّل → نعيد إرسال OTP
      if (!existing.emailVerified) {
        const { code } = await createOtpCode(
          email,
          "EMAIL_VERIFY",
          existing.id
        );

        const { subject, html, text } = renderOtpEmailTemplate(
          code,
          existing.fullName
        );

        const emailResult = await sendEmail(
          { to: email, subject, html, text },
          code
        );

        return NextResponse.json({
          success: true,
          message: "تم إعادة إرسال رمز التحقق",
          emailMode: emailResult.mode,
          displayedCode: emailResult.displayedCode,
          email: existing.email,
          isResend: true,
        });
      }

      if (existing.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: "البريد الإلكتروني مسجل مسبقاً" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "رقم الجوال مسجل مسبقاً" },
          { status: 400 }
        );
      }
    }

    // 5. تشفير كلمة المرور
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 6. إنشاء الحساب
    const visitor = await prisma.visitorAccount.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phoneClean,
        password: hashedPassword,
        bio: bio?.trim() || null,
        website: website?.trim() || null,
        emailVerified: false,
      },
    });

    // 7. إنشاء OTP
    const { code, expiresAt } = await createOtpCode(
      email,
      "EMAIL_VERIFY",
      visitor.id
    );

    // 8. إرسال OTP
    const { subject, html, text } = renderOtpEmailTemplate(
      code,
      fullName
    );

    const emailResult = await sendEmail(
      { to: email, subject, html, text },
      code
    );

    // 9. تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        action: "VISITOR_REGISTER",
        entityType: "VisitorAccount",
        entityId: visitor.id,
        details: `تسجيل زائر جديد: ${email}`,
        ipAddress: ip,
      },
    });

    // 10. الرد
    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحساب، تحقق من بريدك الإلكتروني",
        visitorId: visitor.id,
        email: visitor.email,
        emailMode: emailResult.mode,
        displayedCode: emailResult.displayedCode,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التسجيل" },
      { status: 500 }
    );
  }
}