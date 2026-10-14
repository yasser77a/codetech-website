import type { Metadata } from "next";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import CategoryHero from "@/components/portfolio/CategoryHero";
import CTA from "@/components/home/CTA";
import { getPublicProjects } from "@/lib/prisma-queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "تصاميم جرافيكس",
  description:
    "تصاميم إبداعية من Code Tech: هويات بصرية، شعارات، إعلانات، وتصاميم UI/UX.",
};

export default async function GraphicsPage() {
  const graphics = await getPublicProjects({ category: "GRAPHICS" as any });

  const totalViews = graphics.reduce((acc, p) => acc + p.views, 0);
  const featured = graphics.filter((p) => p.featured).length;
  const totalLikes = graphics.reduce((acc, p) => acc + (p.likesCount || 0), 0);

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      <CategoryHero
        category="graphics"
        count={graphics.length}
        views={totalViews}
        featured={featured}
        likes={totalLikes}
      />

      <PortfolioGrid
        projects={{
          websites: [],
          apps: [],
          systems: [],
          graduation: [],
          graphics,
        }}
        showFilter={false}
        initialCategory="GRAPHICS"
      />

      <CTA />
    </div>
  );
}