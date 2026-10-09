// ============================================
// GET    /api/blog/[id]  - جلب منشور
// PATCH  /api/blog/[id]  - تعديل
// DELETE /api/blog/[id]  - حذف
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

// GET
export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, fullName: true, avatar: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "المنشور غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("GET /api/blog/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

// PATCH
export async function PATCH(request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // جلب المنشور الحالي
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "المنشور غير موجود" },
        { status: 404 }
      );
    }

    // التحقق من الحقول إذا تم تعديلها
    if (body.title !== undefined && body.title.trim().length < 3) {
      return NextResponse.json(
        { error: "العنوان قصير جداً" },
        { status: 400 }
      );
    }

    if (body.content !== undefined && body.content.trim().length < 10) {
      return NextResponse.json(
        { error: "المحتوى قصير جداً" },
        { status: 400 }
      );
    }

    // تحديث publishedAt عند النشر لأول مرة
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt?.trim() || null;
    if (body.content !== undefined) updateData.content = body.content.trim();
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage || null;
    if (body.category !== undefined) updateData.category = body.category?.trim() || null;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "PUBLISHED" && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE",
        entityType: "BlogPost",
        entityId: post.id,
        details: `تعديل منشور: ${post.title}`,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("PATCH /api/blog/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التعديل" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "المنشور غير موجود" },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "DELETE",
        entityType: "BlogPost",
        entityId: id,
        details: `حذف منشور: ${existing.title}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/blog/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الحذف" },
      { status: 500 }
    );
  }
}