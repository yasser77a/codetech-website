// ============================================
// CodeTech Website - OTP Service
// توليد + تحقق رموز OTP
// ============================================

import { prisma } from "./db";
import { randomInt } from "crypto";

// ============================================
// الإعدادات
// ============================================
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export type OtpType = "EMAIL_VERIFY" | "PASSWORD_RESET" | "LOGIN";

// ============================================
// توليد رمز OTP
// ============================================
export function generateOtpCode(): string {
  // crypto.randomInt أكثر أماناً من Math.random
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += randomInt(0, 10).toString();
  }
  return code;
}

// ============================================
// إنشاء OTP جديد (يحذف القديم غير المستخدم)
// ============================================
export async function createOtpCode(
  email: string,
  type: OtpType,
  visitorId?: string
): Promise<{ code: string; expiresAt: Date }> {
  // احذف الرموز القديمة غير المستخدمة من نفس النوع
  await prisma.otpCode.deleteMany({
    where: {
      email: email.toLowerCase(),
      type,
      usedAt: null,
    },
  });

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  const otp = await prisma.otpCode.create({
    data: {
      email: email.toLowerCase(),
      code,
      type,
      expiresAt,
      visitorId: visitorId || null,
    },
  });

  return {
    code: otp.code,
    expiresAt: otp.expiresAt,
  };
}

// ============================================
// التحقق من OTP
// ============================================
export async function verifyOtpCode(
  email: string,
  code: string,
  type: OtpType
): Promise<{
  valid: boolean;
  error?: string;
  otpId?: string;
}> {
  const otp = await prisma.otpCode.findFirst({
    where: {
      email: email.toLowerCase(),
      code,
      type,
      usedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otp) {
    return { valid: false, error: "الرمز غير صحيح" };
  }

  // التحقق من الانتهاء
  if (otp.expiresAt < new Date()) {
    return { valid: false, error: "انتهت صلاحية الرمز، اطلب رمزاً جديداً" };
  }

  // التحقق من عدد المحاولات
  if (otp.attempts >= MAX_ATTEMPTS) {
    return { valid: false, error: "تم تجاوز عدد المحاولات المسموحة" };
  }

  // زيادة عدد المحاولات
  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { attempts: otp.attempts + 1 },
  });

  return { valid: true, otpId: otp.id };
}

// ============================================
// وضع علامة "مستخدم" على OTP
// ============================================
export async function markOtpAsUsed(otpId: string): Promise<void> {
  await prisma.otpCode.update({
    where: { id: otpId },
    data: { usedAt: new Date() },
  });
}

// ============================================
// تنظيف OTPs المنتهية (يُشغَّل دورياً)
// ============================================
export async function cleanupExpiredOtps(): Promise<number> {
  const result = await prisma.otpCode.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { usedAt: { not: null } },
      ],
    },
  });
  return result.count;
}