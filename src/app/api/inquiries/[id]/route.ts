// ============================================
// GET    /api/inquiries/[id]  - جلب استفسار
// PATCH  /api/inquiries/[id]  - تعديل الحالة
// DELETE /api/inquiries/[id]  - حذف
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, fullName: true, avatar: true },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "الاستفسار غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("GET /api/inquiries/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.assignedToId !== undefined && { assignedToId: body.assignedToId }),
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE",
        entityType: "Inquiry",
        entityId: inquiry.id,
        details: `تعديل استفسار من: ${inquiry.name}`,
      },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("PATCH /api/inquiries/[id] error:", error);
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

    await prisma.inquiry.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "DELETE",
        entityType: "Inquiry",
        entityId: id,
        details: "حذف استفسار",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/inquiries/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الحذف" },
      { status: 500 }
    );
  }
}