// ============================================
// PATCH  /api/admin/visitors/[id]  - تعديل زائر
// DELETE /api/admin/visitors/[id]  - حذف زائر
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const updateData: any = {};

    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isBanned !== undefined) updateData.isBanned = body.isBanned;
    if (body.banReason !== undefined) updateData.banReason = body.banReason?.trim() || null;
    if (body.emailVerified !== undefined) updateData.emailVerified = body.emailVerified;
    if (body.fullName !== undefined) updateData.fullName = body.fullName.trim();

    const visitor = await prisma.visitorAccount.update({
      where: { id },
      data: updateData,
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE_VISITOR",
        entityType: "VisitorAccount",
        entityId: visitor.id,
        details: `تعديل زائر: ${visitor.email}`,
      },
    });

    return NextResponse.json({ success: true, visitor });
  } catch (error) {
    console.error("PATCH /api/admin/visitors/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التعديل" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;

    const visitor = await prisma.visitorAccount.findUnique({ where: { id } });
    if (!visitor) {
      return NextResponse.json(
        { error: "الزائر غير موجود" },
        { status: 404 }
      );
    }

    await prisma.visitorAccount.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "DELETE_VISITOR",
        entityType: "VisitorAccount",
        entityId: id,
        details: `حذف زائر: ${visitor.email}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/visitors/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الحذف" },
      { status: 500 }
    );
  }
}