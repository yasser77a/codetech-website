// ============================================
// CodeTech Website - Stats Service
// جلب الإحصائيات من قاعدة البيانات
// ============================================

import { prisma } from "./db";

// ============================================
// Types
// ============================================
export interface DashboardStats {
  // المشاريع
  projects: {
    total: number;
    websites: number;
    apps: number;
    systems: number;
    graduation: number;
    published: number;
    draft: number;
    featured: number;
  };
  // المنشورات
  posts: {
    total: number;
    published: number;
    draft: number;
  };
  // المراجعات
  reviews: {
    total: number;
    approved: number;
    pending: number;
    averageRating: number;
  };
  // الاستفسارات
  inquiries: {
    total: number;
    new: number;
    inProgress: number;
    replied: number;
    closed: number;
  };
  // المستخدمون
  users: {
    total: number;
    admins: number;
    editors: number;
  };
  // الإشعارات
  notifications: {
    unread: number;
  };
  // الخدمات
  services: {
    total: number;
    active: number;
  };
}

// ============================================
// الدالة الرئيسية - تجلب كل الإحصائيات دفعة واحدة
// ============================================
export async function getDashboardStats(): Promise<DashboardStats> {
  // تنفيذ كل الاستعلامات بالتوازي (أسرع 10 مرات من التسلسل)
  const [
    totalProjects,
    websitesCount,
    appsCount,
    systemsCount,
    graduationCount,
    publishedProjects,
    draftProjects,
    featuredProjects,

    totalPosts,
    publishedPosts,
    draftPosts,

    totalReviews,
    approvedReviews,
    pendingReviews,
    reviewsAvg,

    totalInquiries,
    newInquiries,
    inProgressInquiries,
    repliedInquiries,
    closedInquiries,

    totalUsers,
    adminUsers,
    editorUsers,

    unreadNotifications,

    totalServices,
    activeServices,
  ] = await Promise.all([
    // المشاريع
    prisma.project.count(),
    prisma.project.count({ where: { category: "WEBSITES" } }),
    prisma.project.count({ where: { category: "APPS" } }),
    prisma.project.count({ where: { category: "SYSTEMS" } }),
    prisma.project.count({ where: { category: "GRADUATION" } }),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.count({ where: { status: "DRAFT" } }),
    prisma.project.count({ where: { featured: true } }),

    // المنشورات
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "DRAFT" } }),

    // المراجعات
    prisma.review.count(),
    prisma.review.count({ where: { isApproved: true } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.review.aggregate({
      where: { isApproved: true },
      _avg: { rating: true },
    }),

    // الاستفسارات
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { status: "IN_PROGRESS" } }),
    prisma.inquiry.count({ where: { status: "REPLIED" } }),
    prisma.inquiry.count({ where: { status: "CLOSED" } }),

    // المستخدمون
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "EDITOR" } }),

    // الإشعارات
    prisma.notification.count({ where: { isRead: false } }),

    // الخدمات
    prisma.service.count(),
    prisma.service.count({ where: { isActive: true } }),
  ]);

  return {
    projects: {
      total: totalProjects,
      websites: websitesCount,
      apps: appsCount,
      systems: systemsCount,
      graduation: graduationCount,
      published: publishedProjects,
      draft: draftProjects,
      featured: featuredProjects,
    },
    posts: {
      total: totalPosts,
      published: publishedPosts,
      draft: draftPosts,
    },
    reviews: {
      total: totalReviews,
      approved: approvedReviews,
      pending: pendingReviews,
      averageRating: reviewsAvg._avg.rating || 0,
    },
    inquiries: {
      total: totalInquiries,
      new: newInquiries,
      inProgress: inProgressInquiries,
      replied: repliedInquiries,
      closed: closedInquiries,
    },
    users: {
      total: totalUsers,
      admins: adminUsers,
      editors: editorUsers,
    },
    notifications: {
      unread: unreadNotifications,
    },
    services: {
      total: totalServices,
      active: activeServices,
    },
  };
}

// ============================================
// جلب الاستفسارات الأخيرة (للداشبورد)
// ============================================
export async function getRecentInquiries(limit = 4) {
  return await prisma.inquiry.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      serviceType: true,
      message: true,
      status: true,
      createdAt: true,
    },
  });
}

// ============================================
// جلب آخر النشاطات
// ============================================
export async function getRecentActivity(limit = 10) {
  return await prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          fullName: true,
          avatar: true,
        },
      },
    },
  });
}

// ============================================
// جلب أفضل المشاريع (الأكثر مشاهدة)
// ============================================
export async function getTopProjects(limit = 5) {
  return await prisma.project.findMany({
    take: limit,
    where: { status: "PUBLISHED" },
    orderBy: { views: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      views: true,
      coverImage: true,
    },
  });
}