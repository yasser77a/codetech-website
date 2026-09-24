import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Code Tech | كود تك - شركة برمجية متخصصة",
  description:
    "Code Tech – شريكك التقني في صنعاء لإنشاء أضخم البرامج وأقوى التطبيقات والمواقع الإلكترونية بإشراف كادر متخصص وأسعار مناسبة مع إمكانية التسديد بالأقساط.",
  keywords: [
    "Code Tech",
    "كود تك",
    "شركة برمجية",
    "تطوير أنظمة",
    "تطبيقات جوال",
    "مواقع ويب",
    "صنعاء",
    "اليمن",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body className={`${cairo.variable} ${tajawal.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}