import CTA from "@/components/home/CTA";
import BentoPortfolio from "@/components/portfolio/BentoPortfolio";
import { getProjectsByCategory } from "@/lib/prisma-queries";
import {
  Sparkles,
  TrendingUp,
  Award,
  Users,
  ArrowDown,
} from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "معرض أعمالنا",
  description:
    "اكتشف مشاريع Code Tech المتنوعة في مواقع الويب، التطبيقات، الأنظمة، ومشاريع التخرج.",
};

export default async function PortfolioPage() {
  const projects = await getProjectsByCategory();

  const totalProjects =
    projects.websites.length +
    projects.apps.length +
    projects.systems.length +
    projects.graduation.length;

  const totalViews = [
    ...projects.websites,
    ...projects.apps,
    ...projects.systems,
    ...projects.graduation,
  ].reduce((acc, p) => acc + p.views, 0);

  const totalFeatured = [
    ...projects.websites,
    ...projects.apps,
    ...projects.systems,
    ...projects.graduation,
  ].filter((p) => p.featured).length;

  const totalClients = new Set(
    [
      ...projects.websites,
      ...projects.apps,
      ...projects.systems,
      ...projects.graduation,
    ]
      .map((p) => p.client)
      .filter(Boolean)
  ).size;

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f]">
      {/* ============================================ */}
      {/* Hero Section */}
      {/* ============================================ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        {/* Animated Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial Gradient Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[150px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[200px]" />

        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-10 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full font-bold text-sm mb-8 shadow-2xl">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-blue-100">معرض أعمالنا المتميز</span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.95] tracking-tight">
            <span className="block text-white">مشاريع</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
              تفتخر بها
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            مجموعة مختارة من أفضل أعمالنا في مختلف المجالات — من مواقع الويب
            إلى الأنظمة المتكاملة ومشاريع التخرج الجامعية
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {[
              {
                icon: Sparkles,
                value: totalProjects,
                label: "مشروع",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: TrendingUp,
                value: totalViews.toLocaleString("en-US"),
                label: "مشاهدة",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Award,
                value: totalFeatured,
                label: "مميز",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Users,
                value: totalClients,
                label: "عميل",
                color: "from-purple-500 to-pink-500",
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-3 shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-bold">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-2 text-slate-400 animate-bounce">
            <span className="text-xs font-bold">تصفح المشاريع</span>
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Bento Portfolio */}
      {/* ============================================ */}
      <BentoPortfolio projects={projects} />

      {/* ============================================ */}
      {/* CTA */}
      {/* ============================================ */}
      <CTA />
    </div>
  );
}