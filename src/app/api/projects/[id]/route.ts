// ============================================
// GET    /api/projects/[id]  - جلب مشروع واحد
// PATCH  /api/projects/[id]  - تعديل مشروع
// DELETE /api/projects/[id]  - حذف مشروع
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { validateProject } from "@/lib/validators";

interface Context {
  params: Promise<{ id: string }>;
}

// ============================================
// GET - جلب مشروع واحد
// ============================================
export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "المشروع غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المشروع" },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH - تعديل مشروع
// ============================================
export async function PATCH(request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;

    // التحقق من وجود المشروع
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "المشروع غير موجود" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // التحقق من المدخلات (لكن الحقول الاختيارية مسموحة)
    const validation = validateProject({
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      category: body.category ?? existing.category,
      client: body.client !== undefined ? body.client : existing.client,
      status: body.status,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", errors: validation.errors },
        { status: 400 }
      );
    }

    // تحديث المشروع
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.description !== undefined && { description: body.description.trim() }),
        ...(body.content !== undefined && { content: body.content?.trim() || null }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.client !== undefined && { client: body.client?.trim() || null }),
        ...(body.technologies !== undefined && { technologies: body.technologies }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage || null }),
        ...(body.gallery !== undefined && { gallery: body.gallery }),
        ...(body.liveUrl !== undefined && { liveUrl: body.liveUrl || null }),
        ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl || null }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.featured !== undefined && { featured: body.featured === true }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE",
        entityType: "Project",
        entityId: project.id,
        details: `تعديل مشروع: ${project.title}`,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تعديل المشروع" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - حذف مشروع
// ============================================
export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "المشروع غير موجود" },
        { status: 404 }
      );
    }

    await prisma.project.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "DELETE",
        entityType: "Project",
        entityId: id,
        details: `حذف مشروع: ${existing.title}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في حذف المشروع" },
      { status: 500 }
    );
  }
}