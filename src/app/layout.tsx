import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "700", "900"],
  display: "swap",
  preload: true,
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

const SITE_URL = "https://codetech-website-git-main-yasser-alashram.vercel.app";
const SITE_NAME = "Code Tech | كود تك";

// ==========================================
// 📊 Metadata الكاملة (SEO)
// ==========================================
export const metadata: Metadata = {
  // 🔹 الأساسيات
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Code Tech | كود تك - فريق برمجي متخصص في صنعاء",
    template: "%s | Code Tech",
  },
  description:
    "فريق Code Tech البرمجية في صنعاء - نبني أنظمة برمجية بحماية فائقة ودقة عالية. تطوير مواقع الويب، تطبيقات الجوال، الأنظمة الإدارية، ومشاريع التخرج. أسعار مناسبة مع إمكانية التسديد بالأقساط.",

  // 🔹 الكلمات المفتاحية
  keywords: [
    "Code Tech",
    "كود تك",
    "فريق برمجي",
    "شركة برمجيات صنعاء",
    "تطوير مواقع اليمن",
    "تطوير تطبيقات صنعاء",
    "أنظمة إدارية اليمن",
    "مشاريع تخرج",
    "تصميم مواقع",
    "برمجة اليمن",
    "developer yemen",
    "software company sanaa",
    "web development yemen",
    "mobile apps yemen",
  ],

  // 🔹 المؤلفون
  authors: [
    { name: "Yasser Alashram", url: "https://github.com/yasser77a" },
  ],
  creator: "Yasser Alashram",
  publisher: "Code Tech",

  // 🔹 Canonical URL (يمنع المحتوى المكرر)
  alternates: {
    canonical: "/",
    languages: {
      "ar-YE": "/",
    },
  },

  // 🔹 Open Graph (للمشاركة على Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "ar_YE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Code Tech | كود تك - فريق برمجي متخصص في صنعاء",
    description:
      "نبني أنظمة برمجية بحماية فائقة ودقة عالية. تطوير مواقع، تطبيقات، وأنظمة برمجية بإشراف كادر متخصص.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Code Tech - فريق برمجي في صنعاء",
      },
    ],
  },

  // 🔹 Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Code Tech | كود تك",
    description:
      "نبني أنظمة برمجية بحماية فائقة ودقة عالية. تطوير مواقع، تطبيقات، وأنظمة.",
    images: ["/opengraph-image.png"],
    creator: "@yasser77a",
  },

  // 🔹 الأيقونات (Favicon كامل)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  // 🔹 معلومات إضافية
  applicationName: "Code Tech",
  category: "technology",
  classification: "Software Development Company",

  // 🔹 فهرسة Google
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 🔹 التحقق من الملكية (سنملأه لاحقاً في Google Search Console)
  verification: {
    google: "IYLTbCGTvMLSwA8jS0DQJD5LbRhBLsv040liVGcO9j8",
  },

  // 🔹 معلومات أخرى
  other: {
    "theme-color": "#0B3DA8",
    "msapplication-TileColor": "#0B3DA8",
  },
};

// ==========================================
// 📱 Viewport (للجوال)
// ==========================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B3DA8" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

// ==========================================
// 🏢 Structured Data (JSON-LD)
// ==========================================
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Code Tech",
  alternateName: "كود تك",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "فريق برمجي متخصص في تطوير الأنظمة والتطبيقات ومواقع الويب في صنعاء، اليمن.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "الدائري، حي جامعة صنعاء القديمة",
    addressLocality: "صنعاء",
    addressCountry: "YE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+967-775-566-442",
    contactType: "customer service",
    availableLanguage: ["Arabic", "English"],
  },
  sameAs: [
    "https://www.facebook.com/CodeTech.ye",
    "https://github.com/yasser77a",
    "https://wa.me/967775566442",
  ],
  founder: {
    "@type": "Person",
    name: "Yasser Alashram",
    jobTitle: "Full-Stack Developer",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    reviewCount: "2084",
    bestRating: "5",
    worstRating: "1",
  },
  priceRange: "$$",
  areaServed: {
    "@type": "Country",
    name: "Yemen",
  },
  serviceType: [
    "تطوير الأنظمة",
    "تطوير التطبيقات",
    "تطوير مواقع الويب",
    "تصميم جرافيكس",
    "مشاريع تخرج",
  ],
};

// ==========================================
// 📄 Root Layout
// ==========================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <head>
        {/* 🏢 Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`${cairo.variable} ${tajawal.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}