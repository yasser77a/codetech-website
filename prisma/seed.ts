// ============================================
// CodeTech Website - Database Seed
// ============================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء إضافة البيانات الأولية...\n");

  // ============================================
  // 1. المستخدمون
  // ============================================
  console.log("👤 إضافة المستخدمين...");
  
  const adminPassword = await bcrypt.hash("CodeTech@2026", 10);
  
  const admin = await prisma.user.upsert({
    where: { username: "yasser alashram" },
    update: {},
    create: {
      username: "yasser alashram",
      fullName: "ياسر الأشرم",
      email: "yasser@codetech.ye",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log(`   ✅ الأدمن: ${admin.username}`);

  // ============================================
  // 2. المشاريع
  // ============================================
  console.log("\n💼 إضافة المشاريع...");

  const projects = [
    {
      title: "متجر إلكتروني متكامل - اليمن مول",
      slug: "yemen-mall-ecommerce",
      description: "متجر إلكتروني كامل مع لوحة تحكم، دفع إلكتروني، وإدارة مخزون",
      category: "WEBSITES" as const,
      client: "اليمن مول",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      status: "PUBLISHED" as const,
      featured: true,
      views: 1240,
    },
    {
      title: "تطبيق توصيل طلبات - سريع",
      slug: "saree-delivery-app",
      description: "تطبيق توصيل طلبات بأندرويد وآيفون مع تتبع مباشر",
      category: "APPS" as const,
      client: "سريع للتوصيل",
      technologies: ["Flutter", "Firebase", "Node.js"],
      status: "PUBLISHED" as const,
      featured: true,
      views: 2100,
    },
    {
      title: "نظام إدارة مستشفى متكامل",
      slug: "hospital-management-system",
      description: "نظام إدارة مستشفيات: مرضى، مواعيد، فواتير، صيدلية",
      category: "SYSTEMS" as const,
      client: "مستشفى الحياة",
      technologies: ["C#", "SQL Server", ".NET"],
      status: "PUBLISHED" as const,
      featured: true,
      views: 3200,
    },
    {
      title: "نظام ذكاء اصطناعي للتعرف على الوجوه",
      slug: "ai-face-recognition",
      description: "مشروع تخرج بكالوريوس - قسم علوم حاسوب",
      category: "GRADUATION" as const,
      client: "جامعة صنعاء",
      technologies: ["Python", "TensorFlow", "OpenCV"],
      status: "PUBLISHED" as const,
      featured: true,
      views: 980,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
    console.log(`   ✅ ${project.title}`);
  }

  // ============================================
  // 3. الخدمات
  // ============================================
  console.log("\n🛠️ إضافة الخدمات...");

  const services = [
    {
      title: "تطوير المواقع الإلكترونية",
      slug: "web-development",
      description: "مواقع احترافية سريعة ومتجاوبة بأحدث التقنيات",
      icon: "Globe",
      features: ["Next.js", "React", "SEO", "استجابة كاملة"],
      order: 1,
    },
    {
      title: "تطوير تطبيقات الجوال",
      slug: "mobile-apps",
      description: "تطبيقات Android و iOS بأداء عالي",
      icon: "Smartphone",
      features: ["Flutter", "React Native", "Firebase"],
      order: 2,
    },
    {
      title: "أنظمة ERP المتكاملة",
      slug: "erp-systems",
      description: "أنظمة إدارة موارد الشركات",
      icon: "Building2",
      features: ["مخازن", "HR", "مبيعات", "مطاعم"],
      order: 3,
    },
    {
      title: "تصميم واجهات المستخدم UI/UX",
      slug: "ui-ux-design",
      description: "تصاميم عصرية تركز على تجربة المستخدم",
      icon: "Palette",
      features: ["Figma", "Prototyping", "Design System"],
      order: 4,
    },
    {
      title: "الاستشارات التقنية",
      slug: "tech-consulting",
      description: "استشارات في التحول الرقمي والبنية التقنية",
      icon: "Lightbulb",
      features: ["تحليل", "تخطيط", "تنفيذ"],
      order: 5,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
    console.log(`   ✅ ${service.title}`);
  }

  // ============================================
  // 4. المراجعات
  // ============================================
  console.log("\n⭐ إضافة المراجعات...");

  const reviews = [
    {
      name: "أحمد محمد",
      email: "ahmed@example.com",
      company: "اليمن مول",
      content: "خدمة ممتازة واحترافية عالية. الموقع الذي صمموه لنا ضاعف مبيعاتنا!",
      rating: 5,
      isApproved: true,
      isFeatured: true,
    },
    {
      name: "سارة علي",
      email: "sara@example.com",
      company: "مطاعم الشام",
      content: "نظام نقاط البيع الذي طبقوه غيّر طريقة عملنا بالكامل. شكراً Code Tech!",
      rating: 5,
      isApproved: true,
      isFeatured: true,
    },
    {
      name: "خالد عبدالله",
      email: "khaled@example.com",
      position: "مدير تقني",
      content: "فريق محترف، تسليم في الوقت المحدد، ودعم فني ممتاز بعد التسليم.",
      rating: 5,
      isApproved: true,
      isFeatured: false,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
    console.log(`   ✅ ${review.name}`);
  }

  // ============================================
  // 5. إعدادات الموقع
  // ============================================
  console.log("\n⚙️ إضافة إعدادات الموقع...");

  const settings = [
    { key: "site_name", value: "Code Tech", category: "general" },
    { key: "site_description", value: "شركة تطوير برمجيات يمنية متخصصة في المواقع والتطبيقات والأنظمة", category: "general" },
    { key: "contact_phone", value: "+967 775566442", category: "contact" },
    { key: "contact_whatsapp", value: "https://wa.me/967775566442", category: "contact" },
    { key: "contact_facebook", value: "https://www.facebook.com/CodeTech.ye", category: "contact" },
    { key: "contact_location", value: "اليمن - صنعاء", category: "contact" },
    { key: "contact_email", value: "info@codetech.ye", category: "contact" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
    console.log(`   ✅ ${setting.key}`);
  }

  // ============================================
  // 6. إشعار ترحيبي
  // ============================================
  await prisma.notification.create({
    data: {
      title: "مرحباً بك في لوحة التحكم",
      message: "تم إعداد قاعدة البيانات بنجاح. يمكنك البدء بإدارة المحتوى.",
      type: "success",
    },
  });
  console.log("\n🔔 إضافة إشعار ترحيبي");

  console.log("\n🎉 تمت إضافة كل البيانات الأولية بنجاح!\n");
  console.log("📊 الإحصائيات:");
  console.log(`   👤 المستخدمون: ${await prisma.user.count()}`);
  console.log(`   💼 المشاريع: ${await prisma.project.count()}`);
  console.log(`   🛠️ الخدمات: ${await prisma.service.count()}`);
  console.log(`   ⭐ المراجعات: ${await prisma.review.count()}`);
  console.log(`   ⚙️ الإعدادات: ${await prisma.siteSetting.count()}`);
  console.log();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ خطأ:", e);
    await prisma.$disconnect();
    process.exit(1);
  });