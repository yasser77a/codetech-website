-- ============================================
-- إصلاح updatedAt في كل الجداول
-- ============================================

ALTER TABLE "inquiries" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "projects" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "services" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "blog_posts" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "reviews" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "site_settings" ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- ============================================
-- إصلاح createdAt في أي جدول لا يوجد به default
-- ============================================

ALTER TABLE "inquiries" ALTER COLUMN "createdAt" SET DEFAULT NOW();
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT NOW();
ALTER TABLE "projects" ALTER COLUMN "createdAt" SET DEFAULT NOW();
ALTER TABLE "services" ALTER COLUMN "createdAt" SET DEFAULT NOW();
ALTER TABLE "blog_posts" ALTER COLUMN "createdAt" SET DEFAULT NOW();
ALTER TABLE "reviews" ALTER COLUMN "createdAt" SET DEFAULT NOW();
ALTER TABLE "comments" ALTER COLUMN "createdAt" SET DEFAULT NOW();
ALTER TABLE "notifications" ALTER COLUMN "createdAt" SET DEFAULT NOW();
ALTER TABLE "activity_logs" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- ============================================
-- التحقق
-- ============================================

SELECT 
  table_name, 
  column_name, 
  column_default 
FROM information_schema.columns 
WHERE column_name IN ('createdAt', 'updatedAt') 
  AND table_schema = 'public'
ORDER BY table_name, column_name;