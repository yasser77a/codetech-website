// ============================================
// PATCH  /api/projects/[id]/clients/[clientId]  - تعديل عميل
// DELETE /api/projects/[id]/clients/[clientId]  - حذف عميل
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string; clientId: string }>;
}

// PATCH - تعديل
export async function PATCH(request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { clientId } = await context.params;
    const body = await request.json();

    const existing = await prisma.projectClient.findUnique({
      where: { id: clientId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }

    const client = await prisma.projectClient.update({
      where: { id: clientId },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.company !== undefined && { company: body.company?.trim() || null }),
        ...(body.logo !== undefined && { logo: body.logo || null }),
        ...(body.industry !== undefined && { industry: body.industry?.trim() || null }),
        ...(body.location !== undefined && { location: body.location?.trim() || null }),
        ...(body.website !== undefined && { website: body.website?.trim() || null }),
        ...(body.usedSince !== undefined && {
          usedSince: body.usedSince ? new Date(body.usedSince) : null,
        }),
        ...(body.notes !== undefined && { notes: body.notes?.trim() || null }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return NextResponse.json({ success: true, client });
  } catch (error) {
    console.error("PATCH /api/projects/[id]/clients/[clientId] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التعديل" },
      { status: 500 }
    );
  }
}

// DELETE - حذف
export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { clientId } = await context.params;

    const existing = await prisma.projectClient.findUnique({
      where: { id: clientId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }

    await prisma.projectClient.delete({ where: { id: clientId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id]/clients/[clientId] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الحذف" },
      { status: 500 }
    );
  }
}