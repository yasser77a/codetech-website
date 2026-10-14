// ============================================
// GET /api/public/projects/stats?id=xxx&type=PROJECT
// يجلب إحصائيات مشروع أو منشور (إعجابات، تعليقات، مشاركات)
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { getVisitorSession } from "@/lib/visitor-auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") || "PROJECT";

    if (!id) {
      return NextResponse.json(
        { error: "id مطلوب" },
        { status: 400 }
      );
    }

    // جلب العدادات + حالة الإعجاب
    let stats: {
      likesCount: number;
      commentsCount: number;
      sharesCount: number;
      userLiked: boolean;
    } = {
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      userLiked: false,
    };

    if (type === "PROJECT") {
      const project = await prisma.project.findUnique({
        where: { id },
        select: {
          likesCount: true,
          commentsCount: true,
          sharesCount: true,
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: "المشروع غير موجود" },
          { status: 404 }
        );
      }

      stats.likesCount = project.likesCount;
      stats.commentsCount = project.commentsCount;
      stats.sharesCount = project.sharesCount;

      // حالة الإعجاب
      const visitorSession = await getVisitorSession();
      const cookieStore = await cookies();
      const visitorId = cookieStore.get("visitor_id")?.value;

      if (visitorSession) {
        const existing = await prisma.like.findFirst({
          where: {
            userId: visitorSession.visitorId,
            targetType: "PROJECT",
            targetId: id,
          },
        });
        stats.userLiked = !!existing;
      } else if (visitorId) {
        const existing = await prisma.like.findFirst({
          where: {
            visitorId,
            targetType: "PROJECT",
            targetId: id,
          },
        });
        stats.userLiked = !!existing;
      }
    } else if (type === "BLOG_POST") {
      const post = await prisma.blogPost.findUnique({
        where: { id },
        select: {
          likesCount: true,
          commentsCount: true,
          sharesCount: true,
        },
      });

      if (!post) {
        return NextResponse.json(
          { error: "المنشور غير موجود" },
          { status: 404 }
        );
      }

      stats.likesCount = post.likesCount;
      stats.commentsCount = post.commentsCount;
      stats.sharesCount = post.sharesCount;
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/public/projects/stats error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الإحصائيات" },
      { status: 500 }
    );
  }
}