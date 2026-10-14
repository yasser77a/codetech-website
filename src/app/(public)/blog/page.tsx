import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Eye,
  User,
  Calendar,
} from "lucide-react";
import { prisma } from "@/lib/db";
import CTA from "@/components/home/CTA";

export const metadata: Metadata = {
  title: "المدونة",
  description:
    "مقالات ومواضيع تقنية من Code Tech: تطوير الويب، التطبيقات، الأنظمة، والتصميم.",
};

export const revalidate = 300;

// ==========================================
// Page
// ==========================================
export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
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

  const totalViews = posts.reduce((acc, p) => acc + p.views, 0);

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] min-h-screen transition-colors duration-300">
      {/* ============================================ */}
      {/* Hero */}
      {/* ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-400/30 dark:bg-indigo-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-400/30 dark:bg-cyan-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 py-20 md:py-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-indigo-200/50 dark:border-white/10 px-5 py-2.5 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-100">
              مدونة Code Tech
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-slate-900 dark:text-white">مقالات </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400">
              ومواضيع
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            نشارك خبراتنا ومعرفتنا في عالم البرمجة والتقنية
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-indigo-100 dark:border-white/10 rounded-2xl p-4 shadow-lg">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                {posts.length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                مقال
              </div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-indigo-100 dark:border-white/10 rounded-2xl p-4 shadow-lg">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                {totalViews.toLocaleString("en-US")}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                مشاهدة
              </div>
            </div>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-indigo-100 dark:border-white/10 rounded-2xl p-4 shadow-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                جديد
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                كل أسبوع
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Posts */}
      {/* ============================================ */}
      <section className="py-16 md:py-20 bg-white dark:bg-[#0a0a0f]">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                لا توجد مقالات بعد
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                نعمل على تجهيز مقالات تقنية مفيدة لك. تابعنا قريباً!
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold transition hover:scale-105 shadow-lg"
              >
                اقترح موضوعاً
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white dark:bg-[#12121a] rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Cover Image */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-500"
                  >
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/30" />
                      </div>
                    )}

                    {/* Category Badge */}
                    {post.category && (
                      <span className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1.5 rounded-full font-bold border border-white/20">
                        {post.category}
                      </span>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="p-5">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("ar-YE")
                          : new Date(post.createdAt).toLocaleDateString("ar-YE")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {post.views}
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition min-h-[56px]">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 min-h-[60px]">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Author */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                          {post.author?.fullName?.[0] || "C"}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {post.author?.fullName || "Code Tech"}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        اقرأ المزيد ←
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTA />
    </div>
  );
}