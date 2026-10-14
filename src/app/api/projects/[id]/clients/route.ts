// ============================================
// POST /api/projects/[id]/clients  - إضافة عميل
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // التحقق
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { error: "اسم العميل مطلوب" },
        { status: 400 }
      );
    }

    // التحقق من وجود المشروع
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json(
        { error: "المشروع غير موجود" },
        { status: 404 }
      );
    }

    const client = await prisma.projectClient.create({
      data: {
        name: body.name.trim(),
        company: body.company?.trim() || null,
        logo: body.logo || null,
        industry: body.industry?.trim() || null,
        location: body.location?.trim() || null,
        website: body.website?.trim() || null,
        usedSince: body.usedSince ? new Date(body.usedSince) : null,
        notes: body.notes?.trim() || null,
        order: body.order || 0,
        isActive: body.isActive !== false,
        projectId: id,
      },
    });

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects/[id]/clients error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إضافة العميل" },
      { status: 500 }
    );
  }
}

// GET - جلب عملاء المشروع
export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;

    const clients = await prisma.projectClient.findMany({
      where: { projectId: id, isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("GET /api/projects/[id]/clients error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب العملاء" },
      { status: 500 }
    );
  }
}