"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users as UsersIcon, Search, Shield, User as UserIcon, Crown, Plus, X, Calendar, Trash2, Loader2, Save } from "lucide-react";

interface UserData {
  id: string;
  username: string;
  fullName: string;
  role: "admin" | "editor" | "viewer";
  createdAt: string;
}

const roleMap = {
  admin: { label: "مدير", icon: Crown, color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" },
  editor: { label: "محرر", icon: Shield, color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" },
  viewer: { label: "مشاهد", icon: UserIcon, color: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
};

export default function UsersManager() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    loadUsers();
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.includes(search) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">المستخدمين</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {users.length} مستخدم
            </p>
          </div>
        </div>

        {/* ✅ زر إضافة مستخدم */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          مستخدم جديد
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مستخدم..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((user) => {
              const RoleInfo = roleMap[user.role];
              const RoleIcon = RoleInfo.icon;
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black text-xl">
                      {user.fullName[0]}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 ${RoleInfo.color}`}>
                        <RoleIcon className="w-3 h-3" />
                        {RoleInfo.label}
                      </span>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1">
                    {user.fullName}
                  </h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-3" dir="ltr">
                    @{user.username}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(user.createdAt).toLocaleDateString("ar-YE")}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal إضافة مستخدم */}
      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadUsers();
          }}
        />
      )}
    </div>
  );
}

function AddUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">مستخدم جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              اسم المستخدم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              كلمة المرور <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
              dir="ltr"
              minLength={6}
              required
            />
            <p className="text-xs text-slate-500 mt-1">6 أحرف على الأقل</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              الدور
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as any })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
            >
              <option value="viewer">مشاهد</option>
              <option value="editor">محرر</option>
              <option value="admin">مدير</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              إضافة المستخدم
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}