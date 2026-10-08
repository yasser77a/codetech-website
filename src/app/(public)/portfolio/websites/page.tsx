import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import CTA from "@/components/home/CTA";
import { getPublicProjects } from "@/lib/prisma-queries";
import { Globe, Sparkles, TrendingUp, Users, Award } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "مواقع الويب",
  description: "مشاريع مواقع الويب التي طورتها Code Tech",
};

export default async function WebsitesPage() {
  const websites = await getPublicProjects({ category: "WEBSITES" });

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-800 text-white py-24 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full font-bold text-sm mb-6 border border-white/20">
            <Sparkles className="w-4 h-4" />
            مواقع احترافية
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-100">
              مواقع
            </span>
            <span className="block text-blue-100 text-4xl lg:text-5xl mt-2">
              الويب
            </span>
          </h1>

          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            مواقع احترافية بتقنيات حديثة وأداء عالي
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 min-w-[140px] border border-white/20">
              <Globe className="w-6 h-6 mx-auto mb-2 text-cyan-300" />
              <div className="text-3xl font-black">{websites.length}</div>
              <div className="text-sm text-blue-100">موقع</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 min-w-[140px] border border-white/20">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-300" />
              <div className="text-3xl font-black">
                {websites.reduce((acc, p) => acc + p.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-blue-100">مشاهدة</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 min-w-[140px] border border-white/20">
              <Award className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
              <div className="text-3xl font-black">
                {websites.filter((p) => p.featured).length}
              </div>
              <div className="text-sm text-blue-100">مميز</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 min-w-[140px] border border-white/20">
              <Users className="w-6 h-6 mx-auto mb-2 text-purple-300" />
              <div className="text-3xl font-black">
                {new Set(websites.map((p) => p.client).filter(Boolean)).size}
              </div>
              <div className="text-sm text-blue-100">عميل</div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <PortfolioGrid
        projects={{ websites, apps: [], systems: [], graduation: [] }}
        showFilter={false}
        initialCategory="WEBSITES"
      />

      <CTA />
    </div>
  );
}