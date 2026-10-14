// ============================================
// PATCH  /api/comments/[id]  - تعديل (موافقة، رفض، رد)
// DELETE /api/comments/[id]  - حذف
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

// ============================================
// PATCH - تعديل التعليق
// ============================================
export async function PATCH(request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "التعليق غير موجود" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // موافقة/رفض
    if (body.status !== undefined) {
      const validStatuses = ["PENDING", "APPROVED", "REJECTED", "SPAM"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "حالة غير صحيحة" },
          { status: 400 }
        );
      }
      updateData.status = body.status;
    }

    // رد الأدمن
    if (body.adminReply !== undefined) {
      updateData.adminReply = body.adminReply?.trim() || null;
      updateData.repliedAt = body.adminReply ? new Date() : null;
      updateData.repliedById = body.adminReply ? session.userId : null;
    }

    // تعديل المحتوى
    if (body.content !== undefined) {
      if (body.content.trim().length < 5) {
        return NextResponse.json(
          { error: "التعليق قصير جداً" },
          { status: 400 }
        );
      }
      updateData.content = body.content.trim();
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: updateData,
    });

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE",
        entityType: "Comment",
        entityId: comment.id,
        details: `تعديل تعليق من: ${comment.name}`,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("PATCH /api/comments/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التعديل" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - حذف التعليق
// ============================================
export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "التعليق غير موجود" },
        { status: 404 }
      );
    }

    await prisma.comment.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "DELETE",
        entityType: "Comment",
        entityId: id,
        details: `حذف تعليق من: ${existing.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/comments/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الحذف" },
      { status: 500 }
    );
  }
}