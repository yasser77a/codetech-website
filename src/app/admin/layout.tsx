import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ThemeProvider } from "@/components/admin/ThemeProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | Code Tech",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div
        suppressHydrationWarning
        className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300"
        dir="rtl"
      >
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0" suppressHydrationWarning>
          <AdminHeader />
          <main
            suppressHydrationWarning
            className="flex-1 p-6 overflow-x-hidden"
          >
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}