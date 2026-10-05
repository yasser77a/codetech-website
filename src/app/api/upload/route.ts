// ============================================
// POST /api/upload
// رفع صورة إلى Supabase Storage
// ============================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin, BUCKETS } from "@/lib/supabase";

// الحد الأقصى لحجم الملف: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// الأنواع المسموحة
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function POST(request: Request) {
  try {
    // التحقق من الجلسة
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // التحقق من Supabase Admin
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client غير مهيأ" },
        { status: 500 }
      );
    }

    // قراءة FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "misc";

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم إرسال ملف" },
        { status: 400 }
      );
    }

    // التحقق من النوع
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `نوع الملف غير مسموح. المسموح: JPG, PNG, WEBP, GIF, SVG` },
        { status: 400 }
      );
    }

    // التحقق من الحجم
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "حجم الملف يجب أن يكون أقل من 5 MB" },
        { status: 400 }
      );
    }

    // تحديد الـ bucket
    const bucketName = folder.split("/")[0] as keyof typeof BUCKETS;
    const bucket = BUCKETS[bucketName] || BUCKETS.projects;

    // توليد اسم فريد
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const fileName = `${folder}/${timestamp}-${random}.${ext}`;

    // تحويل File إلى Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // رفع إلى Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: `فشل الرفع: ${error.message}` },
        { status: 500 }
      );
    }

    // الحصول على الرابط العام
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      bucket,
    });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في رفع الملف" },
      { status: 500 }
    );
  }
}