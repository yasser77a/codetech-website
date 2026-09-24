import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم إرسال أي ملف" },
        { status: 400 }
      );
    }

    // التحقق من النوع
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم. استخدم JPG, PNG, WEBP, GIF, أو SVG" },
        { status: 400 }
      );
    }

    // التحقق من الحجم (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "حجم الملف كبير جداً (الحد 5MB)" },
        { status: 400 }
      );
    }

    // إنشاء المجلد إن لم يوجد
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // اسم الملف
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(uploadDir, filename);

    // الحفظ
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${folder}/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "فشل رفع الملف" },
      { status: 500 }
    );
  }
}