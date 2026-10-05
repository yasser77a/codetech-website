// ============================================
// GET  /api/inquiries  - جلب الاستفسارات
// POST /api/inquiries  - إنشاء استفسار (من الموقع العام)
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// ============================================
// GET - جلب الاستفسارات (للأدمن)
// ============================================
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: {
          select: { id: true, fullName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الاستفسارات" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - إنشاء استفسار جديد (من الموقع العام)
// ============================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // التحقق من المدخلات
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "الاسم والبريد والرسالة مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق من البريد
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صحيح" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        subject: body.subject?.trim() || null,
        message: body.message.trim(),
        serviceType: body.serviceType?.trim() || null,
        budget: body.budget?.trim() || null,
        status: "NEW",
      },
    });

    // إنشاء إشعار
    await prisma.notification.create({
      data: {
        title: "استفسار جديد",
        message: `${body.name} أرسل استفساراً جديداً`,
        type: "inquiry",
        link: `/admin/inquiries/${inquiry.id}`,
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إرسال الاستفسار" },
      { status: 500 }
    );
  }
}