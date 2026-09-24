export type ProjectCategory = "websites" | "apps" | "systems" | "graduation";
export type ProjectStatus = "published" | "draft" | "archived";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  client: string;
  technologies: string[];
  coverImage: string;
  status: ProjectStatus;
  featured: boolean;
  createdAt: string;
  views: number;
}

export const initialProjects: Project[] = [
  // مواقع
  {
    id: "w1",
    title: "متجر إلكتروني متكامل - اليمن مول",
    description: "متجر إلكتروني كامل مع لوحة تحكم، دفع إلكتروني، وإدارة مخزون",
    category: "websites",
    client: "اليمن مول",
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe"],
    coverImage: "",
    status: "published",
    featured: true,
    createdAt: "2025-08-15",
    views: 1240,
  },
  {
    id: "w2",
    title: "موقع شركة عقارية",
    description: "موقع عرض عقارات مع بحث متقدم ونظام حجز مواعيد",
    category: "websites",
    client: "عقارات صنعاء",
    technologies: ["React", "Laravel", "MySQL"],
    coverImage: "",
    status: "published",
    featured: false,
    createdAt: "2025-07-20",
    views: 890,
  },
  {
    id: "w3",
    title: "موقع أخبار رياضي",
    description: "بوابة إخبارية رياضية مع نظام إدارة محتوى",
    category: "websites",
    client: "رياضة اليوم",
    technologies: ["WordPress", "PHP"],
    coverImage: "",
    status: "draft",
    featured: false,
    createdAt: "2025-09-01",
    views: 0,
  },

  // تطبيقات
  {
    id: "a1",
    title: "تطبيق توصيل طلبات - سريع",
    description: "تطبيق توصيل طلبات بأندرويد وآيفون مع تتبع مباشر",
    category: "apps",
    client: "سريع للتوصيل",
    technologies: ["Flutter", "Firebase", "Node.js"],
    coverImage: "",
    status: "published",
    featured: true,
    createdAt: "2025-06-10",
    views: 2100,
  },
  {
    id: "a2",
    title: "تطبيق تعليمي للأطفال",
    description: "تطبيق تعليمي تفاعلي للأطفال من 5-12 سنة",
    category: "apps",
    client: "مدارس المستقبل",
    technologies: ["React Native", "Firebase"],
    coverImage: "",
    status: "published",
    featured: false,
    createdAt: "2025-05-22",
    views: 1560,
  },

  // أنظمة
  {
    id: "s1",
    title: "نظام إدارة مستشفى متكامل",
    description: "نظام إدارة مستشفيات: مرضى، مواعيد، فواتير، صيدلية",
    category: "systems",
    client: "مستشفى الحياة",
    technologies: ["C#", "SQL Server", ".NET"],
    coverImage: "",
    status: "published",
    featured: true,
    createdAt: "2025-04-15",
    views: 3200,
  },
  {
    id: "s2",
    title: "نظام نقاط بيع POS",
    description: "نظام كاشير متكامل للمتاجر والمطاعم",
    category: "systems",
    client: "مطاعم الشام",
    technologies: ["Electron", "Node.js", "SQLite"],
    coverImage: "",
    status: "published",
    featured: false,
    createdAt: "2025-03-10",
    views: 1890,
  },

  // مشاريع تخرج
  {
    id: "g1",
    title: "نظام ذكاء اصطناعي للتعرف على الوجوه",
    description: "مشروع تخرج بكالوريوس - قسم علوم حاسوب",
    category: "graduation",
    client: "جامعة صنعاء",
    technologies: ["Python", "TensorFlow", "OpenCV"],
    coverImage: "",
    status: "published",
    featured: true,
    createdAt: "2025-06-01",
    views: 980,
  },
  {
    id: "g2",
    title: "نظام إنترنت الأشياء للمنازل الذكية",
    description: "مشروع تخرج - قسم هندسة حاسوب",
    category: "graduation",
    client: "جامعة العلوم والتكنولوجيا",
    technologies: ["Arduino", "Node.js", "MQTT"],
    coverImage: "",
    status: "published",
    featured: false,
    createdAt: "2025-05-15",
    views: 760,
  },
];

export const categoryLabels: Record<ProjectCategory, string> = {
  websites: "مواقع الويب",
  apps: "تطبيقات الجوال",
  systems: "الأنظمة البرمجية",
  graduation: "مشاريع التخرج",
};

export const statusLabels: Record<ProjectStatus, string> = {
  published: "منشور",
  draft: "مسودة",
  archived: "مؤرشف",
};