"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Lock, Save, Shield, Loader2, User, Mail, Crown, AlertCircle } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function SettingsPage() {
  const [user, setUser] = useState<{
    id: string;
    username: string;
    fullName: string;
    role: string;
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ fullName: "", username: "", role: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setForm({
            fullName: data.user.fullName,
            username: data.user.username,
            role: data.user.role,
          });
          setIsAdmin(
            data.user.role === "admin" ||
            data.user.username === "yasser alashram"
          );
        }
      });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileMsg({ type: "error", text: data.error });
      } else {
        setProfileMsg({ type: "success", text: "تم تحديث البيانات بنجاح" });
        setUser(data.user);
      }
    } catch {
      setProfileMsg({ type: "error", text: "تعذر الاتصال بالخادم" });
    }
    setProfileSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "كلمتا المرور غير متطابقتين" });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordMsg({ type: "error", text: data.error });
      } else {
        setPasswordMsg({ type: "success", text: "تم تغيير كلمة المرور بنجاح" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMsg({ type: "error", text: "تعذر الاتصال بالخادم" });
    }
    setPasswordLoading(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* الرأس */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">الإعدادات</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">إدارة حسابك الشخصي</p>
        </div>
      </div>

      {/* معلومات الحساب */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">الملف الشخصي</h2>
          {isAdmin && (
            <span className="text-xs bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 px-2 py-1 rounded-full font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" />
              مدير
            </span>
          )}
        </div>

        {/* شارة الصلاحيات */}
        {!isAdmin && (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>ملاحظة:</strong> يمكنك تعديل اسمك الكامل فقط. باقي الحقول ثابتة.
              للحصول على صلاحيات كاملة، تواصل مع المدير.
            </div>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              الاسم الكامل
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                اسم المستخدم
                {!isAdmin && <span className="text-xs text-slate-400 mr-2">(ثابت)</span>}
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => isAdmin && setForm({ ...form, username: e.target.value })}
                disabled={!isAdmin}
                className={`w-full rounded-xl px-4 py-3 focus:outline-none dark:text-white ${
                  isAdmin
                    ? "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500"
                    : "bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-60"
                }`}
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                الدور
                {!isAdmin && <span className="text-xs text-slate-400 mr-2">(ثابت)</span>}
              </label>
              <select
                value={form.role}
                onChange={(e) => isAdmin && setForm({ ...form, role: e.target.value })}
                disabled={!isAdmin}
                className={`w-full rounded-xl px-4 py-3 focus:outline-none dark:text-white ${
                  isAdmin
                    ? "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500"
                    : "bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-60"
                }`}
              >
                <option value="admin">مدير</option>
                <option value="editor">محرر</option>
                <option value="viewer">مشاهد</option>
              </select>
            </div>
          </div>

          {profileMsg && (
            <div className={`p-3 rounded-xl text-sm font-semibold ${
              profileMsg.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
            }`}>
              {profileMsg.type === "success" ? "✅" : "⚠️"} {profileMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={profileSaving}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
          >
            {profileSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            حفظ التغييرات
          </button>
        </form>
      </motion.div>

      {/* تغيير كلمة المرور */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">تغيير كلمة المرور</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              كلمة المرور الحالية
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:text-white"
                required
              />
            </div>
          </div>

          {passwordMsg && (
            <div className={`p-3 rounded-xl text-sm font-semibold ${
              passwordMsg.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
            }`}>
              {passwordMsg.type === "success" ? "✅" : "⚠️"} {passwordMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
          >
            {passwordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            تغيير كلمة المرور
          </button>
        </form>
      </motion.div>
    </div>
  );
}