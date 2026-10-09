// ============================================
// GET /api/settings  - جلب الإعدادات (عام)
// PUT /api/settings  - تحديث الإعدادات (أدمن)
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET - جلب كل الإعدادات
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: "asc" },
    });

    // تحويل المصفوفة إلى كائن key-value
    const settingsObject: Record<string, string> = {};
    settings.forEach((s) => {
      settingsObject[s.key] = s.value;
    });

    return NextResponse.json({ settings: settingsObject });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الإعدادات" },
      { status: 500 }
    );
  }
}

// PUT - تحديث الإعدادات (bulk)
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح - يتطلب صلاحيات مدير" },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body.settings || typeof body.settings !== "object") {
      return NextResponse.json(
        { error: "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    // تحديث كل إعداد
    const updates = Object.entries(body.settings).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: {
          key,
          value: String(value),
          category: (body.categories?.[key] as string) || "general",
        },
      })
    );

    await Promise.all(updates);

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE",
        entityType: "SiteSettings",
        details: `تحديث ${Object.keys(body.settings).length} إعداد`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الإعدادات" },
      { status: 500 }
    );
  }
}