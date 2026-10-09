"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  X,
  Save,
  Loader2,
  AlertCircle,
  Filter,
  Calendar,
  MessageSquare,
  RefreshCw,
  Star,
} from "lucide-react";
import ImageUploader from "./ImageUploader";

// ==========================================
// Types
// ==========================================
type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string | null;
  tags: string[];
  status: PostStatus;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; fullName: string; avatar: string | null } | null;
  _count?: { comments: number };
}

// ==========================================
// Status Config
// ==========================================
const statusConfig: Record<
  PostStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  DRAFT: {
    label: "مسودة",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-500/20",
    borderColor: "border-yellow-200 dark:border-yellow-500/30",
  },
  PUBLISHED: {
    label: "منشور",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-500/20",
    borderColor: "border-green-200 dark:border-green-500/30",
  },
  ARCHIVED: {
    label: "مؤرشف",
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-700",
    borderColor: "border-slate-200 dark:border-slate-600",
  },
};

// ==========================================
// Main Component
// ==========================================
export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // ==========================================
  // Fetch Posts
  // ==========================================
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/blog");
      const data = await res.json();

      if (res.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.error || "فشل في جلب المنشورات");
      }
    } catch (err) {
      console.error("Fetch posts error:", err);
      setError("تعذر الاتصال بالخادم");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ==========================================
  // Handlers
  // ==========================================
  const openAdd = () => {
    setEditingPost(null);
    setShowModal(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنشور؟")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
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
    fetchPosts();
  };

  // ==========================================
  // Filter
  // ==========================================
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt || "").toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || p.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [posts, search, statusFilter]);

  // ==========================================
  // Stats
  // ==========================================
  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((p) => p.status === "PUBLISHED").length,
      draft: posts.filter((p) => p.status === "DRAFT").length,
      archived: posts.filter((p) => p.status === "ARCHIVED").length,
    }),
    [posts]
  );

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              المدونة
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {stats.total} منشور • {stats.published} منشور • {stats.draft} مسودة
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </button>
          <button
            onClick={openAdd}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            منشور جديد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "الكل", value: stats.total, status: null, color: "from-blue-500 to-cyan-500" },
          { label: "منشور", value: stats.published, status: "PUBLISHED" as const, color: "from-green-500 to-emerald-500" },
          { label: "مسودة", value: stats.draft, status: "DRAFT" as const, color: "from-yellow-500 to-orange-500" },
          { label: "مؤرشف", value: stats.archived, status: "ARCHIVED" as const, color: "from-slate-500 to-slate-700" },
        ].map((stat) => {
          const isActive = statusFilter === (stat.status || "all");
          return (
            <button
              key={stat.label}
              onClick={() => setStatusFilter((stat.status || "all") as any)}
              className={`rounded-2xl p-4 text-right transition border-2 ${
                isActive
                  ? "border-purple-300 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-500/10"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في المنشورات..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          >
            <option value="all">الكل</option>
            <option value="PUBLISHED">منشور</option>
            <option value="DRAFT">مسودة</option>
            <option value="ARCHIVED">مؤرشف</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
          <button onClick={fetchPosts} className="text-sm font-bold hover:underline">
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center border border-slate-100 dark:border-slate-700">
          <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold mb-4">
            {search || statusFilter !== "all" ? "لا توجد نتائج" : "لا توجد منشورات بعد"}
          </p>
          {!search && statusFilter === "all" && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold transition hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              ابدأ بأول منشور
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((post) => {
              const config = statusConfig[post.status];
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-lg transition group"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-bold ${config.bgColor} ${config.color} backdrop-blur`}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h3 className="font-black text-slate-900 dark:text-white mb-2 line-clamp-1">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString("ar-YE")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                      {post._count && post._count.comments > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post._count.comments}
                        </span>
                      )}
                    </div>

                    {/* Category & Tags */}
                    {post.category && (
                      <div className="mb-3">
                        <span className="text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full font-bold">
                          {post.category}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <button
                        onClick={() => openEdit(post)}
                        className="flex-1 p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 rounded-lg transition flex items-center justify-center gap-1"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-xs font-bold">تعديل</span>
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PostModal
          post={editingPost}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ==========================================
// Post Modal
// ==========================================
function PostModal({
  post,
  onClose,
  onSave,
}: {
  post: BlogPost | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    category: post?.category || "",
    tags: post?.tags || [],
    status: (post?.status || "DRAFT") as PostStatus,
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "العنوان مطلوب";
    else if (form.title.trim().length < 3) newErrors.title = "العنوان قصير جداً";

    if (!form.content.trim()) newErrors.content = "المحتوى مطلوب";
    else if (form.content.trim().length < 10) newErrors.content = "المحتوى قصير جداً";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    setServerError("");

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      coverImage: form.coverImage || null,
      category: form.category.trim() || null,
      tags: form.tags,
      status: form.status,
    };

    try {
      const res = post
        ? await fetch(`/api/blog/${post.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();

      if (res.ok) {
        onSave();
      } else {
        setServerError(data.error || "فشل الحفظ");
        setSaving(false);
      }
    } catch {
      setServerError("تعذر الاتصال بالخادم");
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

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
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 p-6 flex items-center justify-between z-10 rounded-t-3xl">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {post ? "تعديل المنشور" : "منشور جديد"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Cover Image */}
          <ImageUploader
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
            folder="blog"
            label="صورة الغلاف"
          />

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              العنوان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setErrors({ ...errors, title: "" });
              }}
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 focus:outline-none dark:text-white ${
                errors.title
                  ? "border-red-500"
                  : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              }`}
              placeholder="عنوان المنشور..."
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              الملخص
            </label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white resize-none"
              placeholder="ملخص قصير للمنشور (يظهر في القائمة)..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              المحتوى <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={12}
              value={form.content}
              onChange={(e) => {
                setForm({ ...form, content: e.target.value });
                setErrors({ ...errors, content: "" });
              }}
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 focus:outline-none dark:text-white resize-none font-mono text-sm ${
                errors.content
                  ? "border-red-500"
                  : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              }`}
              placeholder="اكتب محتوى المنشور... (يدعم Markdown)"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          {/* Category + Status */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                التصنيف
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                placeholder="مثال: تطوير، تصميم، نصائح"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                الحالة
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as PostStatus })
                }
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
              >
                <option value="DRAFT">مسودة</option>
                <option value="PUBLISHED">منشور</option>
                <option value="ARCHIVED">مؤرشف</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              الوسوم
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 dark:text-white"
                placeholder="أضف وسم واضغط Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-xl transition"
              >
                إضافة
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {serverError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 p-6 flex gap-3 rounded-b-3xl">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {post ? "حفظ التعديلات" : "نشر المنشور"}
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