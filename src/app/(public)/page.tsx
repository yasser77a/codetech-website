import { getPublicProjects } from "@/lib/prisma-queries";
import HomeContent from "@/components/home/HomeContent";

export const revalidate = 60;

export default async function HomePage() {
  // ✅ جلب المشاريع كمصفوفة مسطّحة
  const projects = await getPublicProjects({ limit: 12 });

  return <HomeContent projects={projects} />;
}