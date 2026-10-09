// ============================================
// CodeTech Website - Email Service (Hybrid)
// ============================================
// يدعم 3 أوضاع:
//   - display: عرض OTP على الشاشة (للاختبار والطوارئ)
//   - gmail:   Gmail SMTP (مجاني 500/يوم)
//   - resend:  Resend.com (احترافي، يحتاج domain)
// ============================================

import { Resend } from "resend";

// ============================================
// Types
// ============================================
export type EmailMode = "display" | "gmail" | "resend";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  success: boolean;
  mode: EmailMode;
  messageId?: string;
  error?: string;
  // للوضع display
  displayedCode?: string;
}

// ============================================
// قراءة الإعدادات
// ============================================
function getEmailMode(): EmailMode {
  const mode = process.env.EMAIL_MODE as EmailMode;
  if (["display", "gmail", "resend"].includes(mode)) {
    return mode;
  }
  // الافتراضي: display
  return "display";
}

// ============================================
// الوضع 1: Display (عرض على الشاشة)
// ============================================
async function sendViaDisplay(
  options: SendEmailOptions,
  extraCode?: string
): Promise<SendEmailResult> {
  console.log("\n📺 ═══════════════════════════════════════");
  console.log("📺 EMAIL_MODE=display — لن يتم إرسال بريد");
  console.log("📺 ═══════════════════════════════════════");
  console.log(`📺 إلى:    ${options.to}`);
  console.log(`📺 الموضوع: ${options.subject}`);
  if (extraCode) {
    console.log(`📺 ┌──────────────────────────────┐`);
    console.log(`📺 │   رمز التحقق: ${extraCode.padEnd(16)}│`);
    console.log(`📺 └──────────────────────────────┘`);
  }
  console.log("📺 ═══════════════════════════════════════\n");

  return {
    success: true,
    mode: "display",
    displayedCode: extraCode,
  };
}

// ============================================
// الوضع 2: Gmail SMTP (مجاني)
// ============================================
async function sendViaGmail(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return {
      success: false,
      mode: "gmail",
      error: "GMAIL_USER أو GMAIL_APP_PASSWORD غير معدّ",
    };
  }

  try {
    // Dynamic import لأن nodemailer ثقيل
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"Code Tech" <${user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return {
      success: true,
      mode: "gmail",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Gmail SMTP error:", error);
    return {
      success: false,
      mode: "gmail",
      error: error instanceof Error ? error.message : "فشل إرسال Gmail",
    };
  }
}

// ============================================
// الوضع 3: Resend (احترافي)
// ============================================
async function sendViaResend(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    return {
      success: false,
      mode: "resend",
      error: "RESEND_API_KEY غير معدّ",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        mode: "resend",
        error: error.message,
      };
    }

    return {
      success: true,
      mode: "resend",
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Resend exception:", error);
    return {
      success: false,
      mode: "resend",
      error: error instanceof Error ? error.message : "فشل إرسال Resend",
    };
  }
}

// ============================================
// الدالة الرئيسية
// ============================================
export async function sendEmail(
  options: SendEmailOptions,
  extraCode?: string
): Promise<SendEmailResult> {
  const mode = getEmailMode();

  switch (mode) {
    case "display":
      return sendViaDisplay(options, extraCode);
    case "gmail":
      return sendViaGmail(options);
    case "resend":
      return sendViaResend(options);
    default:
      return sendViaDisplay(options, extraCode);
  }
}

// ============================================
// قوالب البريد
// ============================================

// قالب OTP
export function renderOtpEmailTemplate(
  code: string,
  fullName: string
): { subject: string; html: string; text: string } {
  const subject = `رمز التحقق الخاص بك - Code Tech`;
  
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f5; margin: 0; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0B3DA8 0%, #06B6D4 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 900; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
        .content { padding: 40px 30px; text-align: center; }
        .content h2 { color: #0f172a; font-size: 22px; margin: 0 0 10px 0; }
        .content p { color: #475569; line-height: 1.6; margin: 0 0 30px 0; }
        .code-box { background: #f1f5f9; border: 2px dashed #0B3DA8; border-radius: 12px; padding: 25px; margin: 20px 0; }
        .code { font-size: 42px; font-weight: 900; letter-spacing: 8px; color: #0B3DA8; font-family: 'Courier New', monospace; }
        .expiry { color: #ef4444; font-size: 14px; font-weight: bold; margin-top: 15px; }
        .footer { background: #f8fafc; padding: 25px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Code Tech</h1>
          <p>كود تك - فريق برمجي متخصص</p>
        </div>
        <div class="content">
          <h2>مرحباً ${fullName} 👋</h2>
          <p>شكراً لتسجيلك في Code Tech.<br>استخدم الرمز التالي لتأكيد حسابك:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
            <div class="expiry">⏱️ ينتهي خلال 10 دقائق</div>
          </div>
          
          <p style="font-size: 13px; color: #64748b;">
            إذا لم تكن أنت من طلب هذا الرمز، يمكنك تجاهل هذه الرسالة.
          </p>
        </div>
        <div class="footer">
          © 2026 Code Tech — جميع الحقوق محفوظة<br>
          صنعاء، اليمن — +967 775566442
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
مرحباً ${fullName}،

رمز التحقق الخاص بك في Code Tech هو: ${code}

ينتهي خلال 10 دقائق.

إذا لم تكن أنت من طلب هذا الرمز، يمكنك تجاهل هذه الرسالة.

فريق Code Tech
  `;

  return { subject, html, text };
}