// ✅ Server Component — بدون "use client"
import { getPublicProjects } from "@/lib/prisma-queries";
import PortfolioTabs from "./PortfolioTabs";

export default async function PortfolioSection() {
  const projects = await getPublicProjects({ limit: 12 });
  return <PortfolioTabs projects={projects} />;
}