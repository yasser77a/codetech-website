import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

// ًںŒگ ط¹ظ†ظˆط§ظ† ط§ظ„ظ…ظˆظ‚ط¹ (ط؛ظٹظ‘ط±ظ‡ ط¹ظ†ط¯ ط±ط¨ط· ط¯ظˆظ…ظٹظ† ظ…ط®طµطµ ظ„ط§ط­ظ‚ط§ظ‹)
const SITE_URL = "https://codetech-website-git-main-yasser-alashram.vercel.app";
const SITE_NAME = "Code Tech | ظƒظˆط¯ طھظƒ";

// ==========================================
// ًں“ٹ Metadata ط§ظ„ظƒط§ظ…ظ„ط© (SEO)
// ==========================================
export const metadata: Metadata = {
  // ًں”¹ ط§ظ„ط£ط³ط§ط³ظٹط§طھ
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Code Tech | ظƒظˆط¯ طھظƒ - ظپط±ظٹظ‚ ط¨ط±ظ…ط¬ظٹ ظ…طھط®طµطµ ظپظٹ طµظ†ط¹ط§ط،",
    template: "%s | Code Tech",
  },
  description:
    "ظپط±ظٹظ‚ Code Tech ط§ظ„ط¨ط±ظ…ط¬ظٹط© ظپظٹ طµظ†ط¹ط§ط، - ظ†ط¨ظ†ظٹ ط£ظ†ط¸ظ…ط© ط¨ط±ظ…ط¬ظٹط© ط¨ط­ظ…ط§ظٹط© ظپط§ط¦ظ‚ط© ظˆط¯ظ‚ط© ط¹ط§ظ„ظٹط©. طھط·ظˆظٹط± ظ…ظˆط§ظ‚ط¹ ط§ظ„ظˆظٹط¨طŒ طھط·ط¨ظٹظ‚ط§طھ ط§ظ„ط¬ظˆط§ظ„طŒ ط§ظ„ط£ظ†ط¸ظ…ط© ط§ظ„ط¥ط¯ط§ط±ظٹط©طŒ ظˆظ…ط´ط§ط±ظٹط¹ ط§ظ„طھط®ط±ط¬. ط£ط³ط¹ط§ط± ظ…ظ†ط§ط³ط¨ط© ظ…ط¹ ط¥ظ…ظƒط§ظ†ظٹط© ط§ظ„طھط³ط¯ظٹط¯ ط¨ط§ظ„ط£ظ‚ط³ط§ط·.",

  // ًں”¹ ط§ظ„ظƒظ„ظ…ط§طھ ط§ظ„ظ…ظپطھط§ط­ظٹط©
  keywords: [
    "Code Tech",
    "ظƒظˆط¯ طھظƒ",
    "ظپط±ظٹظ‚ ط¨ط±ظ…ط¬ظٹ",
    "ط´ط±ظƒط© ط¨ط±ظ…ط¬ظٹط§طھ طµظ†ط¹ط§ط،",
    "طھط·ظˆظٹط± ظ…ظˆط§ظ‚ط¹ ط§ظ„ظٹظ…ظ†",
    "طھط·ظˆظٹط± طھط·ط¨ظٹظ‚ط§طھ طµظ†ط¹ط§ط،",
    "ط£ظ†ط¸ظ…ط© ط¥ط¯ط§ط±ظٹط© ط§ظ„ظٹظ…ظ†",
    "ظ…ط´ط§ط±ظٹط¹ طھط®ط±ط¬",
    "طھطµظ…ظٹظ… ظ…ظˆط§ظ‚ط¹",
    "ط¨ط±ظ…ط¬ط© ط§ظ„ظٹظ…ظ†",
    "developer yemen",
    "software company sanaa",
    "web development yemen",
    "mobile apps yemen",
  ],

  // ًں”¹ ط§ظ„ظ…ط¤ظ„ظپظˆظ†
  authors: [
    { name: "Yasser Alashram", url: "https://github.com/yasser77a" },
  ],
  creator: "Yasser Alashram",
  publisher: "Code Tech",

  // ًں”¹ Canonical URL (ظٹظ…ظ†ط¹ ط§ظ„ظ…ط­طھظˆظ‰ ط§ظ„ظ…ظƒط±ط±)
  alternates: {
    canonical: "/",
    languages: {
      "ar-YE": "/",
    },
  },

  // ًں”¹ Open Graph (ظ„ظ„ظ…ط´ط§ط±ظƒط© ط¹ظ„ظ‰ Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "ar_YE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Code Tech | ظƒظˆط¯ طھظƒ - ظپط±ظٹظ‚ ط¨ط±ظ…ط¬ظٹ ظ…طھط®طµطµ ظپظٹ طµظ†ط¹ط§ط،",
    description:
      "ظ†ط¨ظ†ظٹ ط£ظ†ط¸ظ…ط© ط¨ط±ظ…ط¬ظٹط© ط¨ط­ظ…ط§ظٹط© ظپط§ط¦ظ‚ط© ظˆط¯ظ‚ط© ط¹ط§ظ„ظٹط©. طھط·ظˆظٹط± ظ…ظˆط§ظ‚ط¹طŒ طھط·ط¨ظٹظ‚ط§طھطŒ ظˆط£ظ†ط¸ظ…ط© ط¨ط±ظ…ط¬ظٹط© ط¨ط¥ط´ط±ط§ظپ ظƒط§ط¯ط± ظ…طھط®طµطµ.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Code Tech - ظپط±ظٹظ‚ ط¨ط±ظ…ط¬ظٹ ظپظٹ طµظ†ط¹ط§ط،",
      },
    ],
  },

  // ًں”¹ Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Code Tech | ظƒظˆط¯ طھظƒ",
    description:
      "ظ†ط¨ظ†ظٹ ط£ظ†ط¸ظ…ط© ط¨ط±ظ…ط¬ظٹط© ط¨ط­ظ…ط§ظٹط© ظپط§ط¦ظ‚ط© ظˆط¯ظ‚ط© ط¹ط§ظ„ظٹط©. طھط·ظˆظٹط± ظ…ظˆط§ظ‚ط¹طŒ طھط·ط¨ظٹظ‚ط§طھطŒ ظˆط£ظ†ط¸ظ…ط©.",
    images: ["/opengraph-image.png"],
    creator: "@yasser77a",
  },

  // ًں”¹ ط§ظ„ط£ظٹظ‚ظˆظ†ط§طھ (Favicon ظƒط§ظ…ظ„)
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

  // ًں”¹ ظ…ط¹ظ„ظˆظ…ط§طھ ط¥ط¶ط§ظپظٹط©
  applicationName: "Code Tech",
  category: "technology",
  classification: "Software Development Company",

  // ًں”¹ ظپظ‡ط±ط³ط© Google
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

  // ًں”¹ ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظ…ظ„ظƒظٹط© (ط³ظ†ظ…ظ„ط£ظ‡ ظ„ط§ط­ظ‚ط§ظ‹ ظپظٹ Google Search Console)
  verification: {
    google: "IYLTbCGTvMLSwA8jS0DQJD5LbRhBLsv040liVGcO9j8", // â†گ ط¶ط¹ ظƒظˆط¯ Google ظ‡ظ†ط§ ظ„ط§ط­ظ‚ط§ظ‹
  },

  // ًں”¹ ظ…ط¹ظ„ظˆظ…ط§طھ ط£ط®ط±ظ‰
  other: {
    "theme-color": "#0B3DA8",
    "msapplication-TileColor": "#0B3DA8",
  },
};

// ==========================================
// ًں“± Viewport (ظ„ظ„ط¬ظˆط§ظ„)
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
// ًںڈ¢ Structured Data (JSON-LD)
// ==========================================
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Code Tech",
  alternateName: "ظƒظˆط¯ طھظƒ",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "ظپط±ظٹظ‚ ط¨ط±ظ…ط¬ظٹ ظ…طھط®طµطµ ظپظٹ طھط·ظˆظٹط± ط§ظ„ط£ظ†ط¸ظ…ط© ظˆط§ظ„طھط·ط¨ظٹظ‚ط§طھ ظˆظ…ظˆط§ظ‚ط¹ ط§ظ„ظˆظٹط¨ ظپظٹ طµظ†ط¹ط§ط،طŒ ط§ظ„ظٹظ…ظ†.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ط§ظ„ط¯ط§ط¦ط±ظٹطŒ ط­ظٹ ط¬ط§ظ…ط¹ط© طµظ†ط¹ط§ط، ط§ظ„ظ‚ط¯ظٹظ…ط©",
    addressLocality: "طµظ†ط¹ط§ط،",
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
    "طھط·ظˆظٹط± ط§ظ„ط£ظ†ط¸ظ…ط©",
    "طھط·ظˆظٹط± ط§ظ„طھط·ط¨ظٹظ‚ط§طھ",
    "طھط·ظˆظٹط± ظ…ظˆط§ظ‚ط¹ ط§ظ„ظˆظٹط¨",
    "طھطµظ…ظٹظ… ط¬ط±ط§ظپظٹظƒط³",
    "ظ…ط´ط§ط±ظٹط¹ طھط®ط±ط¬",
  ],
};

// ==========================================
// ًں“„ Root Layout
// ==========================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <head>
        {/* ًںڈ¢ Structured Data (JSON-LD) */}
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
