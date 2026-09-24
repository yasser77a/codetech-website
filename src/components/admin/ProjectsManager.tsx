"use client";
import ImageUploader from "./ImageUploader";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit, Trash2, Eye, Star, Filter,
  Globe, Smartphone, Monitor, GraduationCap, X, Save
} from "lucide-react";
import {
  initialProjects,
  categoryLabels,
  statusLabels,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
} from "@/lib/projects-data";

const categoryIcons: Record<ProjectCategory, any> = {
  websites: Globe,
  apps: Smartphone,
  systems: Monitor,
  graduation: GraduationCap,
};

export default function ProjectsManager({ category }: { category: ProjectCategory }) {
  const [projects, setProjects] = useState<Project[]>(
    initialProjects.filter((p) => p.category === category)
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.client.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  const openAdd = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSave = (project: Project) => {
    if (editingProject) {
      setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    } else {
      setProjects((prev) => [{ ...project, id: `new-${Date.now()}` }, ...prev]);
    }
    setShowModal(false);
  };

  const Icon = categoryIcons[category];

  return (
    <div className="space-y-6">
      
      {/* الرأس */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
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

        <button
          onClick={openAdd}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>مشروع جديد</span>
        </button>
      </div>

      {/* الفلاتر */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث..."
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
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">المشروع</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">العميل</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">التقنيات</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">المشاهدات</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-300">إجراءات</th>
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {project.title}
                            {project.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {project.createdAt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {project.client}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 2).map((tech) => (
                          <span key={tech} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-lg">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 2 && (
                          <span className="text-xs text-slate-500">+{project.technologies.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        project.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : project.status === "draft"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      }`}>
                        {statusLabels[project.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {project.views.toLocaleString("en-US")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(project)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
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

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              لا توجد مشاريع
            </div>
          )}
        </div>
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

function ProjectModal({
    project,
    category,
    onClose,
    onSave,
  }: {
    project: Project | null;
    category: ProjectCategory;
    onClose: () => void;
    onSave: (p: Project) => void;
  }) {
    const [form, setForm] = useState<Project>(
      project || {
        id: "",
        title: "",
        description: "",
        category,
        client: "",
        technologies: [],
        coverImage: "",
        status: "draft",
        featured: false,
        createdAt: new Date().toISOString().split("T")[0],
        views: 0,
      }
    );
    const [techInput, setTechInput] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
  
    const validate = (): boolean => {
      const newErrors: Record<string, string> = {};
  
      if (!form.title.trim()) newErrors.title = "العنوان مطلوب";
      if (!form.description.trim()) newErrors.description = "الوصف مطلوب";
      if (!form.client.trim()) newErrors.client = "العميل مطلوب";
      if (!form.coverImage) newErrors.coverImage = "الصورة مطلوبة - لا يمكن أن تكون فارغة";
      if (form.technologies.length === 0) newErrors.technologies = "أضف تقنية واحدة على الأقل";
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = () => {
      if (!validate()) return;
      onSave(form);
    };
  
    const handleAddTech = () => {
      if (techInput.trim()) {
        setForm({ ...form, technologies: [...form.technologies, techInput.trim()] });
        setTechInput("");
        setErrors({ ...errors, technologies: "" });
      }
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
              {project ? "تعديل المشروع" : "مشروع جديد"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
  
          <div className="p-6 space-y-4">
            {/* رفع الصورة - إلزامي */}
            <ImageUploader
              value={form.coverImage}
              onChange={(url) => {
                setForm({ ...form, coverImage: url });
                setErrors({ ...errors, coverImage: "" });
              }}
              folder={`projects/${category}`}
              required
              label="صورة المشروع"
            />
            {errors.coverImage && (
              <p className="text-red-500 text-sm -mt-2">{errors.coverImage}</p>
            )}
  
            {/* العنوان */}
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
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 focus:outline-none dark:text-white ${
                  errors.title ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
  
            {/* الوصف */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                الوصف <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => {
                  setForm({ ...form, description: e.target.value });
                  setErrors({ ...errors, description: "" });
                }}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 focus:outline-none dark:text-white resize-none ${
                  errors.description ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  العميل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.client}
                  onChange={(e) => {
                    setForm({ ...form, client: e.target.value });
                    setErrors({ ...errors, client: "" });
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 focus:outline-none dark:text-white ${
                    errors.client ? "border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                  }`}
                />
                {errors.client && <p className="text-red-500 text-sm mt-1">{errors.client}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  الحالة
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                >
                  <option value="published">منشور</option>
                  <option value="draft">مسودة</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>
  
            {/* التقنيات */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                التقنيات <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                  placeholder="مثال: React"
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-xl transition"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.technologies.map((tech, i) => (
                  <span key={i} className="bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                    {tech}
                    <button
                      onClick={() => setForm({ ...form, technologies: form.technologies.filter((_, idx) => idx !== i) })}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.technologies && <p className="text-red-500 text-sm mt-1">{errors.technologies}</p>}
            </div>
  
            {/* مميز */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                مشروع مميز ⭐
              </label>
            </div>
          </div>
  
          <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 p-6 flex gap-3 rounded-b-3xl">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              حفظ المشروع
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            >
              إلغاء
            </button>
          </div>
        </motion.div>
      </div>
    );
  }