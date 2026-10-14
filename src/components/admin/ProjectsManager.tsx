"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  Filter,
  Globe,
  Smartphone,
  Monitor,
  GraduationCap,
  Palette,
  X,
  Save,
  Loader2,
  AlertCircle,
  Layers,
  Sparkles,
  Check,
  RefreshCw,
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import ImageGalleryUploader from "./ImageGalleryUploader";
import ProjectClientsManager, {
  type ProjectClient,
} from "./ProjectClientsManager";

// ============================================
// Types
// ============================================
type ProjectCategory =
  | "websites"
  | "apps"
  | "systems"
  | "graduation"
  | "graphics";

type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  category: string;
  client: string | null;
  technologies: string[];
  features: string[];
  coverImage: string | null;
  gallery: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  status: ProjectStatus;
  featured: boolean;
  order: number;
  views: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  clients?: ProjectClient[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Category Config
// ============================================
const categoryLabels: Record<ProjectCategory, string> = {
  websites: "مواقع الويب",
  apps: "تطبيقات الجوال",
  systems: "الأنظمة البرمجية",
  graduation: "مشاريع التخرج",
  graphics: "تصاميم جرافيكس",
};

const categoryMap: Record<ProjectCategory, string> = {
  websites: "WEBSITES",
  apps: "APPS",
  systems: "SYSTEMS",
  graduation: "GRADUATION",
  graphics: "GRAPHICS",
};

const categoryIcons: Record<ProjectCategory, any> = {
  websites: Globe,
  apps: Smartphone,
  systems: Monitor,
  graduation: GraduationCap,
  graphics: Palette,
};

const categoryColors: Record<ProjectCategory, string> = {
  websites: "from-blue-500 to-cyan-500",
  apps: "from-green-500 to-emerald-500",
  systems: "from-purple-500 to-violet-500",
  graduation: "from-orange-500 to-red-500",
  graphics: "from-pink-500 to-rose-500",
};

const statusLabels: Record<ProjectStatus, string> = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
  ARCHIVED: "مؤرشف",
};

// ============================================
// Main Component
// ============================================
export default function ProjectsManager({
  category,
}: {
  category: ProjectCategory;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all"
  );
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // ============================================
  // Fetch Projects
  // ============================================
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/projects?category=${category}`);
      const data = await res.json();

      if (res.ok) {
        setProjects(data.projects || []);
      } else {
        setError(data.error || "فشل في جلب المشاريع");
      }
    } catch (err) {
      console.error("Fetch projects error:", err);
      setError("تعذر الاتصال بالخادم");
    }

    setLoading(false);
  }, [category]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ============================================
  // Handlers
  // ============================================
  const openAdd = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "فشل الحذف");
      }
    } catch {
      alert("تعذر الاتصال بالخادم");
    }
  };

  const handleSave = () => {
    setShowModal(false);
    fetchProjects();
  };

  // ============================================
  // Filter
  // ============================================
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.client || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  const Icon = categoryIcons[category];

  // ============================================
  // Render
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${categoryColors[category]} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {categoryLabels[category]}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              إدارة {projects.length} مشروع
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </button>
          <button
            onClick={openAdd}
            className={`bg-gradient-to-r ${categoryColors[category]} text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg hover:scale-105`}
          >
            <Plus className="w-5 h-5" />
            <span>مشروع جديد</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
          <button
            onClick={fetchProjects}
            className="text-sm font-bold hover:underline"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-slate-100 dark:border-slate-700 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث..."
            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          >
            <option value="all">الكل</option>
            <option value="PUBLISHED">منشور</option>
            <option value="DRAFT">مسودة</option>
            <option value="ARCHIVED">مؤرشف</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Icon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg font-bold mb-4">
              {search || statusFilter !== "all"
                ? "لا توجد نتائج"
                : "لا توجد مشاريع بعد"}
            </p>
            {!search && statusFilter === "all" && (
              <button
                onClick={openAdd}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${categoryColors[category]} text-white px-6 py-3 rounded-xl font-bold transition hover:scale-105`}
              >
                <Plus className="w-5 h-5" />
                ابدأ بأول مشروع
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b-2 border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">
                    المشروع
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">
                    العميل
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">
                    التقنيات
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">
                    إحصائيات
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-300">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <AnimatePresence>
                  {filtered.map((project) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {project.coverImage ? (
                            <img
                              src={project.coverImage}
                              alt={project.title}
                              className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border-2 border-slate-100 dark:border-slate-700"
                            />
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[category]} flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="truncate">
                                {project.title}
                              </span>
                              {project.featured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(project.createdAt).toLocaleDateString(
                                "ar-YE"
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {project.client || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 2).map((tech) => (
                            <span
                              key={tech}
                              className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-lg"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 2 && (
                            <span className="text-xs text-slate-500">
                              +{project.technologies.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            project.status === "PUBLISHED"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                              : project.status === "DRAFT"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {statusLabels[project.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className="flex items-center gap-1 text-slate-600 dark:text-slate-400"
                            title="مشاهدات"
                          >
                            <Eye className="w-3 h-3" />
                            {project.views}
                          </span>
                          <span
                            className="flex items-center gap-1 text-red-500"
                            title="إعجابات"
                          >
                            ❤️ {project.likesCount}
                          </span>
                          <span
                            className="flex items-center gap-1 text-blue-500"
                            title="تعليقات"
                          >
                            💬 {project.commentsCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(project)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 rounded-lg transition"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProjectModal
          project={editingProject}
          category={category}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ============================================
// Project Modal
// ============================================
function ProjectModal({
  project,
  category,
  onClose,
  onSave,
}: {
  project: Project | null;
  category: ProjectCategory;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    content: project?.content || "",
    client: project?.client || "",
    technologies: project?.technologies || [],
    features: project?.features || [],
    coverImage: project?.coverImage || "",
    gallery: project?.gallery || [],
    liveUrl: project?.liveUrl || "",
    githubUrl: project?.githubUrl || "",
    status: (project?.status || "DRAFT") as ProjectStatus,
    featured: project?.featured || false,
    clients: (project?.clients || []) as ProjectClient[],
  });

  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "basic" | "features" | "gallery" | "clients"
  >("basic");

  // ==========================================
  // Validation
  // ==========================================
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "العنوان مطلوب";
    if (form.title.trim().length < 3) newErrors.title = "العنوان قصير جداً";
    if (!form.description.trim()) newErrors.description = "الوصف مطلوب";
    if (form.description.trim().length < 10)
      newErrors.description = "الوصف قصير جداً";
    if (form.technologies.length === 0)
      newErrors.technologies = "أضف تقنية واحدة على الأقل";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // Submit
  // ==========================================
  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    setServerError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      content: form.content?.trim() || null,
      category: categoryMap[category],
      client: form.client.trim() || null,
      technologies: form.technologies,
      features: form.features,
      coverImage: form.coverImage || null,
      gallery: form.gallery,
      liveUrl: form.liveUrl.trim() || null,
      githubUrl: form.githubUrl.trim() || null,
      status: form.status,
      featured: form.featured,
    };

    try {
      const res = project
        ? await fetch(`/api/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "فشل الحفظ");
        if (data.errors) setErrors(data.errors);
        setSaving(false);
        return;
      }

      // إذا كان للمشروع عملاء + ID → أضف العملاء
      const projectId = project?.id || data.project?.id;
      if (projectId && form.clients.length > 0) {
        for (const client of form.clients) {
          if (!client.id) {
            // عميل جديد
            await fetch(`/api/projects/${projectId}/clients`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(client),
            });
          }
        }
      }

      onSave();
    } catch {
      setServerError("تعذر الاتصال بالخادم");
      setSaving(false);
    }
  };

  // ==========================================
  // Add/Remove Tech
  // ==========================================
  const handleAddTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm({ ...form, technologies: [...form.technologies, techInput.trim()] });
      setTechInput("");
      setErrors({ ...errors, technologies: "" });
    }
  };

  const handleRemoveTech = (tech: string) => {
    setForm({
      ...form,
      technologies: form.technologies.filter((t) => t !== tech),
    });
  };

  // ==========================================
  // Add/Remove Feature
  // ==========================================
  const handleAddFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setForm({
      ...form,
      features: form.features.filter((f) => f !== feature),
    });
  };

  // ==========================================
  // Tabs
  // ==========================================
  const tabs = [
    { id: "basic", label: "الأساسي", icon: Layers },
    { id: "features", label: "المميزات", icon: Sparkles },
    { id: "gallery", label: "الواجهات", icon: Palette },
    { id: "clients", label: "العملاء", icon: Check },
  ] as const;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-3xl my-8"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {project ? "تعديل المشروع" : "مشروع جديد"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* ============== TAB: BASIC ============== */}
          {activeTab === "basic" && (
            <>
              {/* Cover Image */}
              <ImageUploader
                value={form.coverImage}
                onChange={(url) => setForm({ ...form, coverImage: url })}
                folder={`projects/${category}`}
                label="صورة الغلاف الرئيسية"
              />

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  عنوان المشروع <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    setErrors({ ...errors, title: "" });
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-900 border-2 rounded-xl px-4 py-3 focus:outline-none dark:text-white transition ${
                    errors.title
                      ? "border-red-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                  }`}
                  placeholder="مثال: متجر إلكتروني متكامل"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  نبذة مختصرة <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => {
                    setForm({ ...form, description: e.target.value });
                    setErrors({ ...errors, description: "" });
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-900 border-2 rounded-xl px-4 py-3 focus:outline-none dark:text-white resize-none transition ${
                    errors.description
                      ? "border-red-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                  }`}
                  placeholder="نبذة قصيرة عن المشروع..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  شرح تفصيلي
                </label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white resize-none"
                  placeholder="شرح كامل للمشروع... (يدعم أسطر متعددة)"
                />
              </div>

              {/* Client + Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    العميل الرئيسي
                  </label>
                  <input
                    type="text"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                    placeholder="مثال: اليمن مول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    الحالة
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as ProjectStatus })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                  >
                    <option value="PUBLISHED">منشور</option>
                    <option value="DRAFT">مسودة</option>
                    <option value="ARCHIVED">مؤرشف</option>
                  </select>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  التقنيات المستخدمة <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTech())
                    }
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 dark:text-white"
                    placeholder="مثال: Next.js"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-xl transition font-bold"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.technologies && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.technologies}
                  </p>
                )}
              </div>

              {/* URLs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    رابط الموقع المباشر
                  </label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) =>
                      setForm({ ...form, liveUrl: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                    placeholder="https://..."
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    رابط الكود المصدري
                  </label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(e) =>
                      setForm({ ...form, githubUrl: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                    placeholder="https://github.com/..."
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl border-2 border-yellow-100 dark:border-yellow-500/20">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-2"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  مشروع مميز (يظهر في المقدمة)
                </label>
              </div>
            </>
          )}

          {/* ============== TAB: FEATURES ============== */}
          {activeTab === "features" && (
            <>
              <div className="bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  أضف مميزات النظام (تظهر في صفحة التفاصيل)
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  إضافة ميزة
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddFeature())
                    }
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                    placeholder="مثال: دفع إلكتروني متكامل"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-5 rounded-xl transition font-bold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة
                  </button>
                </div>

                {/* Features List */}
                {form.features.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      لم تُضف أي مميزات بعد
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {form.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="flex-1 text-slate-700 dark:text-slate-300 text-sm">
                          {feature}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  💡 {form.features.length} ميزة مضافة
                </p>
              </div>
            </>
          )}

          {/* ============== TAB: GALLERY ============== */}
          {activeTab === "gallery" && (
            <>
              <div className="bg-purple-50 dark:bg-purple-500/10 border-2 border-purple-200 dark:border-purple-500/20 rounded-xl p-4">
                <p className="text-sm text-purple-700 dark:text-purple-400 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  أضف صور واجهات النظام (تظهر في معرض الصور)
                </p>
              </div>

              <ImageGalleryUploader
                value={form.gallery}
                onChange={(urls) => setForm({ ...form, gallery: urls })}
                folder={`projects/${category}/gallery`}
                label="صور الواجهات"
                maxImages={10}
              />
            </>
          )}

          {/* ============== TAB: CLIENTS ============== */}
          {activeTab === "clients" && (
            <>
              <div className="bg-green-50 dark:bg-green-500/10 border-2 border-green-200 dark:border-green-500/20 rounded-xl p-4">
                <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  أضف العملاء الذين استخدموا هذا النظام (يظهرون في صفحة التفاصيل)
                </p>
              </div>

              <ProjectClientsManager
                projectId={project?.id}
                clients={form.clients}
                onChange={(clients) => setForm({ ...form, clients })}
              />
            </>
          )}

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {serverError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 p-6 flex gap-3 rounded-b-3xl">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {project ? "حفظ التعديلات" : "نشر المشروع"}
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </motion.div>
    </div>
  );
}