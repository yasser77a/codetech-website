// ============================================
// GET  /api/blog  - جلب المنشورات
// POST /api/blog  - إنشاء منشور
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateSlug } from "@/lib/validators";

// GET - جلب المنشورات
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, fullName: true, avatar: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المنشورات" },
      { status: 500 }
    );
  }
}

// POST - إنشاء منشور جديد
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();

    // التحقق
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "العنوان والمحتوى مطلوبان" },
        { status: 400 }
      );
    }

    if (body.title.trim().length < 3) {
      return NextResponse.json(
        { error: "العنوان قصير جداً" },
        { status: 400 }
      );
    }

    if (body.content.trim().length < 10) {
      return NextResponse.json(
        { error: "المحتوى قصير جداً" },
        { status: 400 }
      );
    }

    // توليد slug فريد
    let slug = generateSlug(body.title);
    let counter = 1;
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${generateSlug(body.title)}-${counter}`;
      counter++;
    }

    // إنشاء المنشور
    const post = await prisma.blogPost.create({
      data: {
        title: body.title.trim(),
        slug,
        excerpt: body.excerpt?.trim() || null,
        content: body.content.trim(),
        coverImage: body.coverImage || null,
        category: body.category?.trim() || null,
        tags: Array.isArray(body.tags) ? body.tags : [],
        status: body.status || "DRAFT",
        publishedAt:
          body.status === "PUBLISHED" ? new Date() : null,
        authorId: session.userId,
      },
    });

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "CREATE",
        entityType: "BlogPost",
        entityId: post.id,
        details: `إنشاء منشور: ${post.title}`,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء المنشور" },
      { status: 500 }
    );
  }
}