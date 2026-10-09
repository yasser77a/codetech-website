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

import type { Metadata } from "next";

export const metadata: Metadata = {
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
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        {/* Animated Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.07] dark:opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial Gradient Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-[150px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/10 dark:bg-cyan-500/5 rounded-full blur-[200px]" />

        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-10 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 px-5 py-2.5 rounded-full font-bold text-sm mb-8 shadow-lg dark:shadow-2xl">
            <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="text-blue-700 dark:text-blue-100">
              معرض أعمالنا المتميز
            </span>
          </div>

          {/* Title - Fixed spacing */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight mb-8">
            <span className="block text-slate-900 dark:text-white mb-4 md:mb-6">
              مشاريع
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
              تفتخر بها
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
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
                  className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-100 dark:border-white/10 rounded-2xl p-5 hover:bg-white dark:hover:bg-white/10 hover:border-blue-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-md dark:shadow-none"
                >
                  <div
                    className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-3 shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 animate-bounce">
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