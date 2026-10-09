// ============================================
// CodeTech Website - Rate Limiting
// ============================================
// حماية بسيطة من السبام (ذاكرة مؤقتة)
// ============================================

interface RateLimitEntry {
    count: number;
    resetAt: number;
  }
  
  // مخزن مؤقت (يُصفّر عند إعادة تشغيل السيرفر)
  const store = new Map<string, RateLimitEntry>();
  
  // تنظيف دوري
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) {
        store.delete(key);
      }
    }
  }, 60 * 1000); // كل دقيقة
  
  // ============================================
  // التحقق من الحد
  // ============================================
  export interface RateLimitOptions {
    maxRequests: number;   // الحد الأقصى
    windowMs: number;      // النافذة الزمنية بالمللي ثانية
    key: string;           // معرّف فريد (IP + action)
  }
  
  export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
  }
  
  export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    const entry = store.get(options.key);
  
    // إذا لا يوجد سجل أو انتهت النافذة
    if (!entry || entry.resetAt < now) {
      const resetAt = now + options.windowMs;
      store.set(options.key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: options.maxRequests - 1,
        resetAt: new Date(resetAt),
      };
    }
  
    // إذا تجاوز الحد
    if (entry.count >= options.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(entry.resetAt),
      };
    }
  
    // زيادة العداد
    entry.count++;
    return {
      allowed: true,
      remaining: options.maxRequests - entry.count,
      resetAt: new Date(entry.resetAt),
    };
  }
  
  // ============================================
  // استخراج IP من الطلب
  // ============================================
  export function getClientIp(request: Request): string {
    const headers = request.headers;
    return (
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headers.get("x-real-ip") ||
      "unknown"
    );
  }
  
  // ============================================
  // Rate limits جاهزة
  // ============================================
  export const RATE_LIMITS = {
    // تسجيل حساب: 3 مرات في الساعة
    REGISTER: {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000,
    },
    // إرسال OTP: 5 مرات في الساعة
    SEND_OTP: {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    },
    // محاولات تسجيل الدخول: 10 في 15 دقيقة
    LOGIN: {
      maxRequests: 10,
      windowMs: 15 * 60 * 1000,
    },
    // تعليق: 5 في الساعة
    COMMENT: {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    },
    // طلب خدمة: 3 في اليوم
    INQUIRY: {
      maxRequests: 3,
      windowMs: 24 * 60 * 60 * 1000,
    },
    // إعجاب: 50 في الساعة
    LIKE: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000,
    },
  };