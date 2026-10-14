import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Eye,
  Check,
  Layers,
  Sparkles,
  Users,
  Building2,
  MapPin,
  Globe,
} from "lucide-react";
import { prisma } from "@/lib/db";
import LikeButton from "@/components/portfolio/LikeButton";
import CommentSection from "@/components/portfolio/CommentSection";
import ShareButton from "@/components/portfolio/ShareButton";
import ProjectGallery from "@/components/portfolio/ProjectGallery";



// ==========================================
// Types
// ==========================================
interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// ==========================================
// Category Mapping
// ==========================================
const categoryMap: Record<
  string,
  {
    label: string;
    enum: string;
    color: string;
    backText: string;
    relatedText: string;
  }
> = {
  websites: {
    label: "مواقع الويب",
    enum: "WEBSITES",
    color: "#3B82F6",
    backText: "العودة للمواقع",
    relatedText: "مواقع أخرى",
  },
  apps: {
    label: "تطبيقات الجوال",
    enum: "APPS",
    color: "#10B981",
    backText: "العودة للتطبيقات",
    relatedText: "تطبيقات أخرى",
  },
  systems: {
    label: "الأنظمة البرمجية",
    enum: "SYSTEMS",
    color: "#8B5CF6",
    backText: "العودة للأنظمة",
    relatedText: "أنظمة أخرى",
  },
  graduation: {
    label: "مشاريع التخرج",
    enum: "GRADUATION",
    color: "#F59E0B",
    backText: "العودة لمشاريع التخرج",
    relatedText: "مشاريع تخرج أخرى",
  },
  graphics: {
    label: "تصاميم جرافيكس",
    enum: "GRAPHICS",
    color: "#EC4899",
    backText: "العودة للتصاميم",
    relatedText: "تصاميم أخرى",
  },
};

export const revalidate = 60;

// ==========================================
// Metadata
// ==========================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = await prisma.project.findFirst({
    where: { slug, status: "PUBLISHED" },
  });

  if (!project) {
    return { title: "المشروع غير موجود" };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

// ==========================================
// Page
// ==========================================
export default async function ProjectDetailPage({ params }: PageProps) {
  const { category, slug } = await params;

  const categoryInfo = categoryMap[category];
  if (!categoryInfo) {
    notFound();
  }

  const project = await prisma.project.findFirst({
    where: {
      slug,
      category: categoryInfo.enum as any,
      status: "PUBLISHED",
    },
    include: {
      clients: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // زيادة المشاهدات
  prisma.project
    .update({
      where: { id: project.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {});

  // مشاريع مشابهة
  const relatedProjects = await prisma.project.findMany({
    where: {
      category: project.category,
      status: "PUBLISHED",
      id: { not: project.id },
    },
    take: 3,
    orderBy: { views: "desc" },
  });

  const completedDate = project.completedAt
    ? new Date(project.completedAt).toLocaleDateString("ar-YE", {
        year: "numeric",
        month: "long",
      })
    : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const fullUrl = `${siteUrl}/portfolio/${category}/${project.slug}`;

  // الصور للعرض
  const allImages = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(project.gallery || []).filter((img) => img !== project.coverImage),
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0f] min-h-screen">
      {/* ============================================ */}
      {/* 1. Back Button */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href={`/portfolio/${category}`}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{categoryInfo.backText}</span>
        </Link>
      </div>

      {/* ============================================ */}
      {/* 2. Header (Badges + Title + Meta + CTA) */}
      {/* ============================================ */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: `${categoryInfo.color}20`,
                color: categoryInfo.color,
              }}
            >
              <Tag className="w-3 h-3" />
              {categoryInfo.label}
            </span>
            {project.featured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                مميز
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            {project.title}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-3xl">
            {project.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600 dark:text-slate-400">
            {project.client && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-bold">{project.client}</span>
              </div>
            )}
            {completedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{completedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{project.views + 1} مشاهدة</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <LikeButton
              targetType="PROJECT"
              targetId={project.id}
              initialCount={project.likesCount}
              size="md"
            />

            <ShareButton
              projectId={project.id}
              projectTitle={project.title}
              projectUrl={fullUrl}
              initialCount={project.sharesCount}
              size="md"
            />

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-bold text-sm transition shadow-md hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                زيارة الموقع
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm transition shadow-md hover:scale-105"
              >
                <FaGithub className="w-4 h-4" />
                الكود
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 3. Main Image (Full Width) */}
      {/* ============================================ */}
      {project.coverImage && (
        <section className="container mx-auto px-4 py-4">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* 4. Content + Features */}
      {/* ============================================ */}
      {(project.content || (project.features && project.features.length > 0)) && (
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Content */}
            {project.content && (
              <div className="bg-white dark:bg-[#12121a] rounded-2xl p-6 md:p-8 border-2 border-slate-100 dark:border-white/10">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  تفاصيل المشروع
                </h2>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {project.content}
                </div>
              </div>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="bg-white dark:bg-[#12121a] rounded-2xl p-6 md:p-8 border-2 border-slate-100 dark:border-white/10">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  مميزات المشروع
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {project.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-white/5"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${categoryInfo.color}20` }}
                      >
                        <Check
                          className="w-4 h-4"
                          style={{ color: categoryInfo.color }}
                        />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* 5. Gallery (Images Grid) */}
      {/* ============================================ */}
      {allImages.length > 1 && (
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2">
                🖼️ واجهات المشروع
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                اضغط على أي صورة لعرضها بحجم كامل
              </p>
            </div>

            <ProjectGallery
              images={allImages}
              title={project.title}
              categoryColor={categoryInfo.color}
            />
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* 6. Counters */}
      {/* ============================================ */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#12121a] rounded-2xl p-5 border-2 border-red-100 dark:border-red-500/20 text-center">
              <div className="text-3xl mb-1">❤️</div>
              <div className="text-2xl font-black text-red-500">
                {project.likesCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                إعجاب
              </div>
            </div>

            <div className="bg-white dark:bg-[#12121a] rounded-2xl p-5 border-2 border-blue-100 dark:border-blue-500/20 text-center">
              <div className="text-3xl mb-1">💬</div>
              <div className="text-2xl font-black text-blue-500">
                {project.commentsCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                تعليق
              </div>
            </div>

            <div className="bg-white dark:bg-[#12121a] rounded-2xl p-5 border-2 border-green-100 dark:border-green-500/20 text-center">
              <div className="text-3xl mb-1">🔗</div>
              <div className="text-2xl font-black text-green-500">
                {project.sharesCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                مشاركة
              </div>
            </div>

            <div className="bg-white dark:bg-[#12121a] rounded-2xl p-5 border-2 border-slate-100 dark:border-white/10 text-center">
              <div className="text-3xl mb-1">👁️</div>
              <div className="text-2xl font-black text-slate-600 dark:text-slate-300">
                {project.views + 1}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                مشاهدة
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 7. Technologies + Info + Clients */}
      {/* ============================================ */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div className="bg-white dark:bg-[#12121a] rounded-2xl p-6 md:p-8 border-2 border-slate-100 dark:border-white/10">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-5">
                🛠️ التقنيات المستخدمة
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl text-sm font-bold border-2 border-blue-100 dark:border-blue-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-white dark:bg-[#12121a] rounded-2xl p-6 md:p-8 border-2 border-slate-100 dark:border-white/10">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-5">
              📋 معلومات سريعة
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {project.client && (
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                  <User className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      العميل الرئيسي
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {project.client}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                <Tag className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    التصنيف
                  </div>
                  <div
                    className="font-bold truncate"
                    style={{ color: categoryInfo.color }}
                  >
                    {categoryInfo.label}
                  </div>
                </div>
              </div>

              {completedDate && (
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                  <Calendar className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      تاريخ الإنجاز
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {completedDate}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                <Eye className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    المشاهدات
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {project.views + 1}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clients */}
          {project.clients && project.clients.length > 0 && (
            <div className="bg-white dark:bg-[#12121a] rounded-2xl p-6 md:p-8 border-2 border-slate-100 dark:border-white/10">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                العملاء
                <span className="text-sm font-bold text-slate-400">
                  ({project.clients.length})
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border-2 border-slate-100 dark:border-white/5"
                  >
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border-2 border-white dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black flex-shrink-0">
                        {client.name[0]}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="font-black text-slate-900 dark:text-white truncate">
                        {client.name}
                      </div>

                      {client.company && (
                        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{client.company}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                        {client.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {client.location}
                          </span>
                        )}
                        {client.industry && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {client.industry}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================ */}
      {/* 8. Comments */}
      {/* ============================================ */}
      <div id="comments">
        <CommentSection
          targetType="PROJECT"
          targetId={project.id}
          title="التعليقات"
        />
      </div>

      {/* ============================================ */}
      {/* 9. Related Projects */}
      {/* ============================================ */}
      {relatedProjects.length > 0 && (
        <section className="py-12 bg-white dark:bg-[#0d0d14] transition-colors">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3">
                {categoryInfo.relatedText}
              </h2>
              <div
                className="h-1 w-20 mx-auto rounded-full"
                style={{ background: categoryInfo.color }}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {relatedProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/portfolio/${category}/${p.slug}`}
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
                    <div
                      className="aspect-video flex items-center justify-center"
                      style={{ background: `${categoryInfo.color}20` }}
                    >
                      <Tag className="w-10 h-10 text-slate-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-black text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition">
                      {p.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}