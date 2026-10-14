import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Tag,
  Clock,
  ArrowRight,
  Share2,
} from "lucide-react";
import { prisma } from "@/lib/db";
import CommentSection from "@/components/portfolio/CommentSection";
import LikeButton from "@/components/portfolio/LikeButton";
import ShareButton from "@/components/portfolio/ShareButton";

// ==========================================
// Types
// ==========================================
interface PageProps {
  params: Promise<{ slug: string }>;
}

// ==========================================
// Metadata (SEO)
// ==========================================
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
  });

  if (!post) {
    return { title: "المقال غير موجود" };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
    },
  };
}

// ==========================================
// Reading Time Calculator
// ==========================================
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// ==========================================
// Page
// ==========================================
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: {
        select: { fullName: true, avatar: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // زيادة المشاهدات
  prisma.blogPost
    .update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {});

  // مقالات أخرى
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: post.id },
      ...(post.category ? { category: post.category } : {}),
    },
    take: 3,
    orderBy: { views: "desc" },
  });

  const readingTime = calculateReadingTime(post.content);
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("ar-YE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date(post.createdAt).toLocaleDateString("ar-YE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const fullUrl = `${siteUrl}/blog/${post.slug}`;

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] min-h-screen transition-colors duration-300">
      {/* ============================================ */}
      {/* 1. Back Button */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للمدونة</span>
        </Link>
      </div>

      {/* ============================================ */}
      {/* 2. Hero */}
      {/* ============================================ */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b-2 border-slate-200 dark:border-slate-700">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-black text-sm">
                {post.author?.fullName?.[0] || "C"}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {post.author?.fullName || "Code Tech"}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {post.author ? "محرر" : "فريق Code Tech"}
                </div>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />

            {/* Date */}
            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{publishedDate}</span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{readingTime} دقيقة قراءة</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <Eye className="w-4 h-4" />
              <span>{post.views + 1} مشاهدة</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 3. Cover Image */}
      {/* ============================================ */}
      {post.coverImage && (
        <section className="container mx-auto px-4 pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* 4. Content */}
      {/* ============================================ */}
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#12121a] rounded-2xl p-6 md:p-10 border-2 border-slate-100 dark:border-white/10">
            <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-loose whitespace-pre-wrap text-base md:text-lg">
              {post.content}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t-2 border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <Tag className="w-4 h-4" />
                  الوسوم
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-indigo-100 dark:border-indigo-500/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ============================================ */}
          {/* 5. Actions (Like + Share) */}
          {/* ============================================ */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#12121a] rounded-2xl p-5 border-2 border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <LikeButton
                targetType="BLOG_POST"
                targetId={post.id}
                initialCount={post.likesCount}
                size="md"
              />

              <ShareButton
                projectId={post.id}
                projectTitle={post.title}
                projectUrl={fullUrl}
                initialCount={post.sharesCount}
                size="md"
              />
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              {post.likesCount + post.sharesCount} تفاعل
            </div>
          </div>
        </div>
      </article>

      {/* ============================================ */}
      {/* 6. Comments */}
      {/* ============================================ */}
      <div id="comments">
        <CommentSection
          targetType="BLOG_POST"
          targetId={post.id}
          title="التعليقات"
        />
      </div>

      {/* ============================================ */}
      {/* 7. Related Posts */}
      {/* ============================================ */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-white dark:bg-[#0d0d14] transition-colors">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3">
                مقالات أخرى
              </h2>
              <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" />
            </div>

            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group bg-slate-50 dark:bg-[#12121a] rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {p.coverImage ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-blue-500/20">
                      <Tag className="w-10 h-10 text-slate-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-black text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition min-h-[48px]">
                      {p.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleDateString("ar-YE")
                        : new Date(p.createdAt).toLocaleDateString("ar-YE")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All */}
            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold transition hover:scale-105 shadow-lg"
              >
                <span>عرض كل المقالات</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}