// ============================================
// CodeTech Website - Prisma Queries
// استعلامات جاهزة للموقع العام
// ============================================

import { prisma } from "./db";
import type { ProjectCategory } from "@prisma/client";

// ============================================
// Type للعرض (Public)
// ============================================
export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  client: string | null;
  technologies: string[];
  coverImage: string | null;
  status: string;
  featured: boolean;
  views: number;
  createdAt: Date;
}

// ============================================
// جلب المشاريع (للموقع العام - Published فقط)
// ============================================
export async function getPublicProjects(options?: {
  category?: ProjectCategory;
  featured?: boolean;
  limit?: number;
}): Promise<PublicProject[]> {
  try {
    const where: any = {
      status: "PUBLISHED",
    };

    if (options?.category) {
      where.category = options.category;
    }

    if (options?.featured !== undefined) {
      where.featured = options.featured;
    }

    const projects = await prisma.project.findMany({
      where,
      take: options?.limit,
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        client: true,
        technologies: true,
        coverImage: true,
        status: true,
        featured: true,
        views: true,
        createdAt: true,
      },
    });

    return projects;
  } catch (error) {
    console.error("getPublicProjects error:", error);
    return [];
  }
}

// ============================================
// جلب مشروع واحد (slug)
// ============================================
export async function getPublicProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
    });

    // زيادة المشاهدات (fire and forget)
    if (project) {
      prisma.project
        .update({
          where: { id: project.id },
          data: { views: { increment: 1 } },
        })
        .catch(() => {});
    }

    return project;
  } catch (error) {
    console.error("getPublicProjectBySlug error:", error);
    return null;
  }
}

// ============================================
// جلب كل المشاريع مقسّمة حسب التصنيف (لتبويبات)
// ============================================
export async function getProjectsByCategory(): Promise<{
  websites: PublicProject[];
  apps: PublicProject[];
  systems: PublicProject[];
  graduation: PublicProject[];
}> {
  try {
    const projects = await getPublicProjects();

    return {
      websites: projects.filter((p) => p.category === "WEBSITES"),
      apps: projects.filter((p) => p.category === "APPS"),
      systems: projects.filter((p) => p.category === "SYSTEMS"),
      graduation: projects.filter((p) => p.category === "GRADUATION"),
    };
  } catch (error) {
    console.error("getProjectsByCategory error:", error);
    return {
      websites: [],
      apps: [],
      systems: [],
      graduation: [],
    };
  }
}

// ============================================
// جلب الخدمات النشطة
// ============================================
export async function getPublicServices() {
  try {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("getPublicServices error:", error);
    return [];
  }
}

// ============================================
// جلب المراجعات المعتمدة
// ============================================
export async function getPublicReviews(options?: { featured?: boolean }) {
  try {
    const where: any = { isApproved: true };
    if (options?.featured !== undefined) {
      where.isFeatured = options.featured;
    }

    return await prisma.review.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("getPublicReviews error:", error);
    return [];
  }
}

// ============================================
// جلب المنشورات المنشورة
// ============================================
export async function getPublicPosts(options?: { limit?: number }) {
  try {
    return await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      take: options?.limit,
      orderBy: { publishedAt: "desc" },
      include: {
        author: {
          select: { fullName: true, avatar: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
  } catch (error) {
    console.error("getPublicPosts error:", error);
    return [];
  }
}

// ============================================
// جلب منشور واحد
// ============================================
export async function getPublicPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: { fullName: true, avatar: true },
        },
        comments: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (post) {
      prisma.blogPost
        .update({
          where: { id: post.id },
          data: { views: { increment: 1 } },
        })
        .catch(() => {});
    }

    return post;
  } catch (error) {
    console.error("getPublicPostBySlug error:", error);
    return null;
  }
}