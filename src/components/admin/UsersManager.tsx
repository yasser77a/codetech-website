"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users as UsersIcon,
  Search,
  Shield,
  User as UserIcon,
  Crown,
  Plus,
  X,
  Calendar,
  Trash2,
  Loader2,
  Save,
  Edit,
  AlertCircle,
  Mail,
  Ban,
  CheckCircle2,
  Key,
  MoreVertical,
} from "lucide-react";

// ============================================
// Types (متوافق مع Prisma enum)
// ============================================
type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

interface UserData {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  role: UserRole;
  avatar: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

// ============================================
// Role Configuration
// ============================================
const roleMap: Record<UserRole, {
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}> = {
  ADMIN: {
    label: "مدير",
    icon: Crown,
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-500/20",
  },
  EDITOR: {
    label: "محرر",
    icon: Shield,
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
  },
  VIEWER: {
    label: "مشاهد",
    icon: UserIcon,
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-700",
  },
};

// ============================================
// Main Component
// ============================================
export default function UsersManager() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ============================================
  // Load Users
  // ============================================
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, meRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/auth/me"),
      ]);

      const usersData = await usersRes.json();
      const meData = await meRes.json();

      if (usersRes.ok) {
        setUsers(usersData.users || []);
      } else {
        setError(usersData.error || "فشل في جلب المستخدمين");
      }

      if (meRes.ok && meData.user) {
        setCurrentUserId(meData.user.id);
      }
    } catch {
      setError("تعذر الاتصال بالخادم");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ============================================
  // Handlers
  // ============================================
  const handleDelete = async (user: UserData) => {
    if (user.id === currentUserId) {
      alert("لا يمكنك حذف حسابك الخاص");
      return;
    }

    if (!confirm(`هل أنت متأكد من حذف "${user.fullName}"؟`)) return;

    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "فشل الحذف");
      return;
    }

    loadUsers();
  };

  const openAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const openEdit = (user: UserData) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  // ============================================
  // Render
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              المستخدمين
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              إدارة {users.length} مستخدم
            </p>
          </div>
        </div>

        <button
          onClick={openAdd}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          مستخدم جديد
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو البريد..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center border border-slate-100 dark:border-slate-700">
          <UsersIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            {search ? "لا توجد نتائج مطابقة" : "لا يوجد مستخدمون"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((user) => {
              const roleInfo = roleMap[user.role];
              const RoleIcon = roleInfo.icon;
              const isCurrentUser = user.id === currentUserId;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition group ${
                    isCurrentUser
                      ? "border-blue-300 dark:border-blue-500/40 ring-2 ring-blue-500/10"
                      : "border-slate-100 dark:border-slate-700 hover:shadow-lg"
                  }`}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black text-xl">
                        {user.fullName[0]}
                      </div>
                      {user.isActive ? (
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                      ) : (
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-slate-400 rounded-full border-2 border-white dark:border-slate-800" />
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 ${roleInfo.bgColor} ${roleInfo.color}`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        {roleInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1 flex items-center gap-2">
                    {user.fullName}
                    {isCurrentUser && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        أنت
                      </span>
                    )}
                  </h3>

                  {/* Username */}
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1" dir="ltr">
                    @{user.username}
                  </div>

                  {/* Email */}
                  {user.email && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1" dir="ltr">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.createdAt).toLocaleDateString("ar-YE")}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 rounded-lg transition"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!isCurrentUser && (
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {!user.isActive && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg">
                      <Ban className="w-3 h-3" />
                      الحساب معطل
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          currentUserId={currentUserId}
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

// ============================================
// User Modal (Add/Edit)
// ============================================
function UserModal({
  user,
  currentUserId,
  onClose,
  onSuccess,
}: {
  user: UserData | null;
  currentUserId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!user;
  const isSelf = user?.id === currentUserId;

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    role: user?.role || ("VIEWER" as UserRole),
    isActive: user?.isActive !== false,
    changePassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      let res;
      if (isEdit) {
        const payload: any = {
          fullName: form.fullName,
          email: form.email || null,
          role: form.role,
          isActive: form.isActive,
        };
        if (form.changePassword && form.password) {
          payload.password = form.password;
        }
        res = await fetch(`/api/users/${user!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.fullName,
            username: form.username,
            email: form.email || null,
            password: form.password,
            role: form.role,
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ");
        if (data.errors) setFieldErrors(data.errors);
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
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md my-8"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {isEdit ? "تعديل المستخدم" : "مستخدم جديد"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Full Name */}
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
            {fieldErrors.fullName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Username (only on create) */}
          {!isEdit && (
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
              {fieldErrors.username && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
              dir="ltr"
              placeholder="user@example.com"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password (only on create) */}
          {!isEdit && (
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
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>
          )}

          {/* Change Password (only on edit) */}
          {isEdit && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.changePassword}
                  onChange={(e) =>
                    setForm({ ...form, changePassword: e.target.checked, password: "" })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Key className="w-4 h-4" />
                  تغيير كلمة المرور
                </span>
              </label>

              {form.changePassword && (
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                  dir="ltr"
                  minLength={6}
                  placeholder="كلمة المرور الجديدة"
                  required
                />
              )}
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              الدور
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
              disabled={isSelf}
            >
              <option value="VIEWER">مشاهد</option>
              <option value="EDITOR">محرر</option>
              <option value="ADMIN">مدير</option>
            </select>
            {isSelf && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                لا يمكنك تغيير دورك الخاص
              </p>
            )}
          </div>

          {/* isActive (only on edit, not self) */}
          {isEdit && !isSelf && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                الحساب نشط
              </label>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? "حفظ التعديلات" : "إضافة المستخدم"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}