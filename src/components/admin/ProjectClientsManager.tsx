"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  X,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Building2,
  MapPin,
  Globe,
  Calendar,
  Save,
} from "lucide-react";

// ============================================
// Types
// ============================================
export interface ProjectClient {
  id?: string;
  name: string;
  company?: string | null;
  logo?: string | null;
  industry?: string | null;
  location?: string | null;
  website?: string | null;
  usedSince?: string | null;
  notes?: string | null;
  order?: number;
}

interface ProjectClientsManagerProps {
  projectId?: string; // إذا كان موجوداً → يحفظ فورياً
  clients: ProjectClient[];
  onChange: (clients: ProjectClient[]) => void;
}

// ============================================
// Component
// ============================================
export default function ProjectClientsManager({
  projectId,
  clients,
  onChange,
}: ProjectClientsManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ProjectClient | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [deleting, setDeleting] = useState<string | null>(null);

  // ==========================================
  // Open modals
  // ==========================================
  const handleAdd = () => {
    setEditingClient(null);
    setEditingIndex(-1);
    setShowModal(true);
  };

  const handleEdit = (client: ProjectClient, index: number) => {
    setEditingClient(client);
    setEditingIndex(index);
    setShowModal(true);
  };

  // ==========================================
  // Delete client
  // ==========================================
  const handleDelete = async (client: ProjectClient, index: number) => {
    if (!confirm(`هل أنت متأكد من حذف "${client.name}"؟`)) return;

    // إذا كان للمشروع ID → حذف من DB
    if (projectId && client.id) {
      setDeleting(client.id);
      try {
        const res = await fetch(
          `/api/projects/${projectId}/clients/${client.id}`,
          { method: "DELETE" }
        );
        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "فشل الحذف");
          setDeleting(null);
          return;
        }
      } catch {
        alert("تعذر الاتصال بالخادم");
        setDeleting(null);
        return;
      }
      setDeleting(null);
    }

    // حذف من القائمة
    onChange(clients.filter((_, i) => i !== index));
  };

  // ==========================================
  // Save client (add or update)
  // ==========================================
  const handleSave = async (client: ProjectClient) => {
    if (editingIndex >= 0) {
      // تعديل
      const updated = [...clients];
      updated[editingIndex] = client;
      onChange(updated);
    } else {
      // إضافة
      onChange([...clients, client]);
    }
    setShowModal(false);
  };

  // ==========================================
  // Render
  // ==========================================
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <Users className="w-4 h-4 text-slate-400" />
          العملاء الذين استخدموا النظام
          <span className="text-xs text-slate-400 font-normal">
            ({clients.length})
          </span>
        </label>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
        >
          <Plus className="w-4 h-4" />
          إضافة عميل
        </button>
      </div>

      {/* Clients List */}
      {clients.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            لم تتم إضافة عملاء بعد
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            أضف العملاء الذين استخدموا هذا النظام
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {clients.map((client, index) => (
              <motion.div
                key={client.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-600 transition group"
              >
                <div className="flex items-start gap-3">
                  {/* Logo or Initial */}
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black flex-shrink-0">
                      {client.name[0]}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 dark:text-white truncate">
                      {client.name}
                    </div>

                    {client.company && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        {client.company}
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
                      {client.usedSince && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(client.usedSince).toLocaleDateString("ar-YE")}
                        </span>
                      )}
                    </div>

                    {client.notes && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {client.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => handleEdit(client, index)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 rounded-lg transition"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(client, index)}
                      disabled={deleting === client.id}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition disabled:opacity-50"
                      title="حذف"
                    >
                      {deleting === client.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ClientModal
          client={editingClient}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ============================================
// Client Modal
// ============================================
function ClientModal({
  client,
  onClose,
  onSave,
}: {
  client: ProjectClient | null;
  onClose: () => void;
  onSave: (client: ProjectClient) => void;
}) {
  const [form, setForm] = useState<ProjectClient>({
    name: client?.name || "",
    company: client?.company || "",
    logo: client?.logo || null,
    industry: client?.industry || "",
    location: client?.location || "",
    website: client?.website || "",
    usedSince: client?.usedSince
      ? new Date(client.usedSince).toISOString().split("T")[0]
      : "",
    notes: client?.notes || "",
  });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("اسم العميل مطلوب (حرفان على الأقل)");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      company: form.company?.trim() || null,
      industry: form.industry?.trim() || null,
      location: form.location?.trim() || null,
      website: form.website?.trim() || null,
      usedSince: form.usedSince || null,
      notes: form.notes?.trim() || null,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg my-8"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            {client ? "تعديل العميل" : "إضافة عميل جديد"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              اسم العميل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setError("");
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="مثال: اليمن مول"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              الشركة / المؤسسة
            </label>
            <input
              type="text"
              value={form.company || ""}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="مثال: شركة اليمن للتجارة"
            />
          </div>

          {/* Industry + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                القطاع
              </label>
              <input
                type="text"
                value={form.industry || ""}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="تجارة"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                الموقع
              </label>
              <input
                type="text"
                value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="صنعاء"
              />
            </div>
          </div>

          {/* Website + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                الموقع الإلكتروني
              </label>
              <input
                type="url"
                value={form.website || ""}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="https://..."
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                يستخدم النظام منذ
              </label>
              <input
                type="date"
                value={form.usedSince || ""}
                onChange={(e) => setForm({ ...form, usedSince: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              ملاحظات
            </label>
            <textarea
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition resize-none"
              placeholder="ملاحظات إضافية عن العميل..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-700 flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {client ? "حفظ التعديلات" : "إضافة العميل"}
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