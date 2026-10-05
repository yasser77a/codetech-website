// ============================================
// CodeTech Website - Supabase Clients
// ============================================

import { createClient } from "@supabase/supabase-js";

// ============================================
// التحقق من المتغيرات
// ============================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error("❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local");
}
if (!SUPABASE_ANON_KEY) {
  throw new Error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local");
}

// ============================================
// العميل العام (للقراءة والاستخدام الآمن)
// يمكن استخدامه في المتصفح والسيرفر
// ============================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // نحن نستخدم JWT خاص بنا
  },
});

// ============================================
// العميل الإداري (لعمليات الرفع والحذف)
// ⚠️ يجب استخدامه في السيرفر فقط!
// ============================================
export const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// ============================================
// أنواع Buckets
// ============================================
export const BUCKETS = {
  projects: "projects",
  blog: "blog",
  avatars: "avatars",
  reviews: "reviews",
} as const;

export type BucketName = keyof typeof BUCKETS;

// ============================================
// الحصول على رابط عام لملف
// ============================================
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}