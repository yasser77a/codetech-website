// ============================================
// GET  /api/projects  - جلب كل المشاريع
// POST /api/projects  - إنشاء مشروع جديد
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { validateProject, generateSlug } from "@/lib/validators";

// ============================================
// GET - جلب المشاريع (مع فلترة)
// ============================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (category) {
      const categoryMap: Record<string, string> = {
        websites: "WEBSITES",
        apps: "APPS",
        systems: "SYSTEMS",
        graduation: "GRADUATION",
      };
      where.category = categoryMap[category.toLowerCase()] || category.toUpperCase();
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { client: { contains: search, mode: "insensitive" } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المشاريع" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - إنشاء مشروع جديد
// ============================================
export async function POST(request: Request) {
  try {
    // التحقق من الجلسة
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // قراءة البيانات
    const body = await request.json();

    // التحقق من المدخلات
    const validation = validateProject(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", errors: validation.errors },
        { status: 400 }
      );
    }

    // توليد slug فريد
    let slug = generateSlug(body.title);
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${generateSlug(body.title)}-${counter}`;
      counter++;
    }

    // إنشاء المشروع
    const project = await prisma.project.create({
      data: {
        title: body.title.trim(),
        slug,
        description: body.description.trim(),
        content: body.content?.trim() || null,
        category: body.category,
        client: body.client?.trim() || null,
        technologies: Array.isArray(body.technologies) ? body.technologies : [],
        coverImage: body.coverImage || null,
        gallery: Array.isArray(body.gallery) ? body.gallery : [],
        liveUrl: body.liveUrl || null,
        githubUrl: body.githubUrl || null,
        status: body.status || "DRAFT",
        featured: body.featured === true,
        order: body.order || 0,
      },
    });

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "CREATE",
        entityType: "Project",
        entityId: project.id,
        details: `إنشاء مشروع: ${project.title}`,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء المشروع" },
      { status: 500 }
    );
  }
}