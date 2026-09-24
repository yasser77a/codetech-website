"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Search, Edit, Trash2, Eye, Save, X, Calendar } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  views: number;
}

const initialPosts: Post[] = [
  {
    id: "1",
    title: "أفضل الممارسات في تطوير تطبيقات الجوال 2026",
    excerpt: "تعرف على أحدث تقنيات وأدوات تطوير تطبيقات الجوال",
    content: "...",
    coverImage: "",
    tags: ["تطبيقات", "برمجة"],
    published: true,
    createdAt: "2026-09-20",
    views: 1240,
  },
  {
    id: "2",
    title: "كيف تختار شركة برمجية لموقعك الإلكتروني",
    excerpt: "دليل شامل لاختيار الشركة المناسبة لمشروعك",
    content: "...",
    coverImage: "",
    tags: ["مواقع", "نصائح"],
    published: true,
    createdAt: "2026-09-15",
    views: 890,
  },
];

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  const filtered = posts.filter((p) =>
    p.title.includes(search) || p.excerpt.includes(search)
  );

  const handleSave = (post: Post) => {
    if (editing) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    } else {
      setPosts((prev) => [{ ...post, id: `new-${Date.now()}` }, ...prev]);
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">المدونة</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {posts.length} مقالة
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          مقالة جديدة
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مقالة..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700"
          >
            <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <FileText className="w-16 h-16 text-white/50" />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  post.published
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                }`}>
                  {post.published ? "منشور" : "مسودة"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.createdAt}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Eye className="w-3 h-3" />
                  {post.views}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditing(post);
                      setShowModal(true);
                    }}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("حذف المقالة؟")) {
                        setPosts((prev) => prev.filter((p) => p.id !== post.id));
                      }
                    }}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <PostModal
          post={editing}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function PostModal({
  post,
  onClose,
  onSave,
}: {
  post: Post | null;
  onClose: () => void;
  onSave: (p: Post) => void;
}) {
  const [form, setForm] = useState<Post>(
    post || {
      id: "",
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tags: [],
      published: false,
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
    }
  );
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "العنوان مطلوب";
    if (!form.excerpt.trim()) newErrors.excerpt = "المقتطف مطلوب";
    if (!form.coverImage) newErrors.coverImage = "الصورة مطلوبة";
    if (!form.content.trim()) newErrors.content = "المحتوى مطلوب";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl my-8"
      >
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 p-6 flex items-center justify-between z-10 rounded-t-3xl">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {post ? "تعديل المقالة" : "مقالة جديدة"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <ImageUploader
            value={form.coverImage}
            onChange={(url) => {
              setForm({ ...form, coverImage: url });
              setErrors({ ...errors, coverImage: "" });
            }}
            folder="blog"
            required
            label="صورة المقالة"
          />
          {errors.coverImage && <p className="text-red-500 text-sm -mt-2">{errors.coverImage}</p>}

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              العنوان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 focus:outline-none dark:text-white ${
                errors.title ? "border-red-500" : "border-slate-200 dark:border-slate-700"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              المقتطف <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 focus:outline-none dark:text-white ${
                errors.excerpt ? "border-red-500" : "border-slate-200 dark:border-slate-700"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              المحتوى <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 focus:outline-none dark:text-white resize-none ${
                errors.content ? "border-red-500" : "border-slate-200 dark:border-slate-700"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="published" className="text-sm font-bold text-slate-700 dark:text-slate-300">
              نشر الآن
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 p-6 flex gap-3 rounded-b-3xl">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            حفظ المقالة
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold"
          >
            إلغاء
          </button>
        </div>
      </motion.div>
    </div>
  );
}