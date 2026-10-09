// ============================================
// PATCH  /api/reviews/[id]  - تعديل
// DELETE /api/reviews/[id]  - حذف
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
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

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "المراجعة غير موجودة" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (body.isApproved !== undefined) updateData.isApproved = body.isApproved;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isVerified !== undefined) updateData.isVerified = body.isVerified;
    if (body.content !== undefined) updateData.content = body.content.trim();
    if (body.rating !== undefined) {
      const rating = parseInt(body.rating);
      if (rating >= 1 && rating <= 5) updateData.rating = rating;
    }
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.company !== undefined) updateData.company = body.company?.trim() || null;
    if (body.position !== undefined) updateData.position = body.position?.trim() || null;

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE",
        entityType: "Review",
        entityId: review.id,
        details: `تعديل مراجعة من: ${review.name}`,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("PATCH /api/reviews/[id] error:", error);
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

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "المراجعة غير موجودة" },
        { status: 404 }
      );
    }

    await prisma.review.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "DELETE",
        entityType: "Review",
        entityId: id,
        details: `حذف مراجعة من: ${existing.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/reviews/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الحذف" },
      { status: 500 }
    );
  }
}