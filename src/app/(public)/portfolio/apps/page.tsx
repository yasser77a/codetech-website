import type { Metadata } from "next";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import CategoryHero from "@/components/portfolio/CategoryHero";
import CTA from "@/components/home/CTA";
import { getPublicProjects } from "@/lib/prisma-queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "تطبيقات الجوال",
  description: "مشاريع تطبيقات الجوال التي طورتها Code Tech",
};

export default async function AppsPage() {
  const apps = await getPublicProjects({ category: "APPS" });

  const totalViews = apps.reduce((acc, p) => acc + p.views, 0);
  const featured = apps.filter((p) => p.featured).length;
  const totalLikes = apps.reduce((acc, p) => acc + (p.likesCount || 0), 0);

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      <CategoryHero
        category="apps"
        count={apps.length}
        views={totalViews}
        featured={featured}
        likes={totalLikes}
      />

      <PortfolioGrid
        projects={{
          websites: [],
          apps,
          systems: [],
          graduation: [],
          graphics: [],
        }}
        showFilter={false}
        initialCategory="APPS"
      />

      <CTA />
    </div>
  );
}