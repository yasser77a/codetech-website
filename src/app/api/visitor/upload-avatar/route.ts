// ============================================
// POST /api/visitor/upload-avatar
// رفع صورة الزائر إلى Supabase Storage
// ============================================

import { NextResponse } from "next/server";
import { getVisitorSession } from "@/lib/visitor-auth";
import { supabaseAdmin, BUCKETS } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const session = await getVisitorSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // ⚠️ التحقق من توفر Supabase Admin client
    if (!supabaseAdmin) {
      console.error("❌ SUPABASE_SERVICE_ROLE_KEY is missing!");
      return NextResponse.json(
        { error: "خطأ في إعدادات الخادم (Service Role Key مفقود)" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "لم يتم رفع صورة" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "يجب رفع ملف صورة صالح" },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "حجم الصورة يجب أن يكون أقل من 2MB" },
        { status: 400 }
      );
    }

    // اسم فريد للملف
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `visitor-${session.visitorId}-${Date.now()}.${ext}`;
    const filePath = `visitors/${fileName}`;

    // تحويل إلى Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ⚠️ الرفع باستخدام supabaseAdmin (يتجاوز RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKETS.avatars) // "avatars"
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error(
        "❌ Supabase upload error:",
        JSON.stringify(uploadError, null, 2)
      );
      return NextResponse.json(
        { error: `فشل رفع الصورة: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // الرابط العام (نستخدم supabase العادي — يعمل للقراءة)
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKETS.avatars)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    });
  } catch (error: any) {
    console.error("❌ Upload avatar error:", error);
    return NextResponse.json(
      { error: error.message || "حدث خطأ في رفع الصورة" },
      { status: 500 }
    );
  }
}