import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getVisitorSession } from "@/lib/visitor-auth";
import { prisma } from "@/lib/db";
import AccountDashboard from "@/components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "حسابي",
  description: "إدارة حسابك الشخصي في Code Tech",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getVisitorSession();

  if (!session) {
    redirect("/visitor-login?from=/account");
  }

  const visitor = await prisma.visitorAccount.findUnique({
    where: { id: session.visitorId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      bio: true,
      website: true,
      avatar: true,
      emailVerified: true,
      isActive: true,
      isBanned: true,
      lastLoginAt: true,
      loginCount: true,
      createdAt: true,
      _count: {
        select: {
          comments: true,
          likes: true,
          inquiries: true,
        },
      },
    },
  });

  if (!visitor) {
    redirect("/visitor-login");
  }

  if (visitor.isBanned) {
    redirect("/?banned=1");
  }

  // جلب آخر النشاطات
  const [recentInquiries, recentComments] = await Promise.all([
    prisma.inquiry.findMany({
      where: { visitorId: visitor.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        subject: true,
        serviceType: true,
        status: true,
        message: true,
        createdAt: true,
      },
    }),
    prisma.comment.findMany({
      where: { visitorId: visitor.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        project: {
          select: { id: true, title: true, slug: true, category: true },
        },
        blogPost: {
          select: { id: true, title: true, slug: true },
        },
      },
    }),
  ]);

  const visitorData = {
    ...visitor,
    lastLoginAt: visitor.lastLoginAt?.toISOString() || null,
    createdAt: visitor.createdAt.toISOString(),
    recentInquiries: recentInquiries.map((i) => ({
      ...i,
      createdAt: i.createdAt.toISOString(),
    })),
    recentComments: recentComments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
  };

  return <AccountDashboard visitor={visitorData} />;
}