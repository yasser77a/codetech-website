import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Smartphone,
  Monitor,
  GraduationCap,
  Palette,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Award,
  Star,
} from "lucide-react";
import { prisma } from "@/lib/db";
import CTA from "@/components/home/CTA";

export const revalidate = 300; 

export const metadata: Metadata = {
  title: "أعمالنا",
  description:
    "استكشف معرض أعمال Code Tech: مواقع الويب، تطبيقات الجوال، الأنظمة البرمجية، مشاريع التخرج، والتصاميم الجرافيكية.",
};


// ==========================================
// Category Config
// ==========================================
const categories = [
  {
    id: "websites",
    label: "مواقع الويب",
    description: "مواقع احترافية بتقنيات حديثة",
    icon: Globe,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/5",
    border: "border-blue-200 dark:border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "apps",
    label: "تطبيقات الجوال",
    description: "تطبيقات Android و iOS بأداء عالٍ",
    icon: Smartphone,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/5",
    border: "border-green-200 dark:border-green-500/20",
    text: "text-green-600 dark:text-green-400",
  },
  {
    id: "systems",
    label: "الأنظمة البرمجية",
    description: "أنظمة ERP وبرامج إدارة متكاملة",
    icon: Monitor,
    gradient: "from-purple-500 to-violet-500",
    bgGradient: "from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/5",
    border: "border-purple-200 dark:border-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "graduation",
    label: "مشاريع التخرج",
    description: "مشاريع تخرج جامعية مميزة",
    icon: GraduationCap,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/5",
    border: "border-orange-200 dark:border-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "graphics",
    label: "تصاميم جرافيكس",
    description: "هويات بصرية وتصاميم إبداعية",
    icon: Palette,
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50 dark:from-pink-500/10 dark:to-rose-500/5",
    border: "border-pink-200 dark:border-pink-500/20",
    text: "text-pink-600 dark:text-pink-400",
  },
];

// ==========================================
// Page
// ==========================================
export default async function PortfolioPage() {
  // جلب إحصائيات كل تصنيف
  const stats = await Promise.all(
    ["WEBSITES", "APPS", "SYSTEMS", "GRADUATION", "GRAPHICS"].map(
      async (category) => {
        const [total, featured, views, likes] = await Promise.all([
          prisma.project.count({
            where: { category: category as any, status: "PUBLISHED" },
          }),
          prisma.project.count({
            where: {
              category: category as any,
              status: "PUBLISHED",
              featured: true,
            },
          }),
          prisma.project.aggregate({
            where: { category: category as any, status: "PUBLISHED" },
            _sum: { views: true },
          }),
          prisma.project.aggregate({
            where: { category: category as any, status: "PUBLISHED" },
            _sum: { likesCount: true },
          }),
        ]);

        return {
          total,
          featured,
          views: views._sum.views || 0,
          likes: likes._sum.likesCount || 0,
        };
      }
    )
  );

  const totalProjects = stats.reduce((sum, s) => sum + s.total, 0);
  const totalViews = stats.reduce((sum, s) => sum + s.views, 0);
  const totalLikes = stats.reduce((sum, s) => sum + s.likes, 0);
  const totalFeatured = stats.reduce((sum, s) => sum + s.featured, 0);

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] min-h-screen transition-colors duration-300">
      {/* ============================================ */}
      {/* Hero */}
      {/* ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 px-5 py-2.5 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-100">
              معرض أعمالنا
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-slate-900 dark:text-white">مشاريع </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
              نفتخر بها
            </span>
          </h1>

          {/* Description (نبذة) */}
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            مجموعة متنوعة من المشاريع التي طوّرناها بشغف واحترافية — من مواقع
            الويب والتطبيقات إلى الأنظمة البرمجية المتكاملة والتصاميم الإبداعية.
            اختر التصنيف الذي يهمك لاستكشاف أعمالنا.
          </p>

          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: totalProjects, label: "مشروع", icon: Sparkles, color: "text-blue-500" },
              { value: totalViews.toLocaleString("en-US"), label: "مشاهدة", icon: TrendingUp, color: "text-green-500" },
              { value: totalLikes, label: "إعجاب", icon: Star, color: "text-red-500" },
              { value: totalFeatured, label: "مميز", icon: Award, color: "text-yellow-500" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-100 dark:border-white/10 rounded-2xl p-5 shadow-lg dark:shadow-none hover:bg-white dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Categories Grid (5 Tabs as Cards) */}
      {/* ============================================ */}
      <section className="py-20 md:py-24 bg-white dark:bg-[#0a0a0f]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              اختر التصنيف
            </h2>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const stat = stats[i];

              return (
                <Link
                  key={cat.id}
                  href={`/portfolio/${cat.id}`}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.bgGradient} border-2 ${cat.border} p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
                >
                  {/* Orbs */}
                  <div
                    className={`absolute top-0 left-0 w-40 h-40 bg-gradient-to-br ${cat.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}
                  />

                  {/* Icon */}
                  <div
                    className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 relative">
                    {cat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 relative">
                    {cat.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5 relative">
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur rounded-xl p-2.5">
                      <div className={`text-xl font-black ${cat.text}`}>
                        {stat.total}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        مشروع
                      </div>
                    </div>
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur rounded-xl p-2.5">
                      <div className={`text-xl font-black ${cat.text}`}>
                        {stat.views.toLocaleString("en-US")}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        مشاهدة
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div
                    className={`flex items-center gap-2 font-bold text-sm ${cat.text} group-hover:gap-3 transition-all relative`}
                  >
                    <span>استكشف المشاريع</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}

            {/* Empty Placeholder (If odd number) */}
            {categories.length % 3 !== 0 && (
              <div className="hidden lg:block" />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA />
    </div>
  );
}