"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  FolderKanban,
  Globe,
  Smartphone,
  Monitor,
  GraduationCap,
  MessageSquare,
  Star,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronLeft,
  LogOut,
  Bell,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "لوحة المعلومات", href: "/admin/dashboard" },
  {
    icon: FolderKanban,
    label: "المشاريع",
    href: "/admin/projects",
    submenu: [
      { icon: Globe, label: "المواقع", href: "/admin/projects/websites" },
      { icon: Smartphone, label: "التطبيقات", href: "/admin/projects/apps" },
      { icon: Monitor, label: "الأنظمة", href: "/admin/projects/systems" },
      { icon: GraduationCap, label: "مشاريع التخرج", href: "/admin/projects/graduation" },
    ],
  },
  { icon: MessageSquare, label: "الاستفسارات", href: "/admin/inquiries", badge: 7 },
  { icon: Star, label: "التقييمات", href: "/admin/reviews" },
  { icon: FileText, label: "المدونة", href: "/admin/blog" },
  { icon: Bell, label: "الإشعارات", href: "/admin/notifications", badge: 3 },
  { icon: Users, label: "المستخدمين", href: "/admin/users" },
  { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
];


export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(["المشاريع"]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-72"
      } bg-slate-900 dark:bg-slate-950 text-white transition-all duration-300 flex flex-col sticky top-0 h-screen flex-shrink-0`}
    >
      {/* الشعار */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-3 flex-1">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Code Tech"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-black">Code Tech</div>
                <div className="text-xs text-slate-400">لوحة التحكم</div>
              </div>
            </Link>
          )}
          {collapsed && (
            <img
              src="/logo.png"
              alt="Code Tech"
              className="w-10 h-10 object-contain mx-auto"
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition flex-shrink-0"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* القائمة */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isOpen = openMenus.includes(item.label);

          return (
            <div key={item.label}>
              {hasSubmenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition ${
                      isActive ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-semibold">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                  <AnimatePresence>
                    {!collapsed && isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mr-4 mt-1 space-y-1 border-r-2 border-white/10 pr-3 overflow-hidden"
                      >
                        {item.submenu!.map((sub) => {
                          const SubIcon = sub.icon;
                          const subActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                                subActive
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{sub.label}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition ${
                    isActive ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-semibold">{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 transition"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-semibold">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}