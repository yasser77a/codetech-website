import { getPublicReviews } from "@/lib/prisma-queries";
import ReviewsContent from "@/components/reviews/ReviewsContent";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "آراء العملاء",
  description:
    "اقرأ تقييمات وآراء عملاء Code Tech الحقيقية في مشاريع تطوير المواقع والتطبيقات والأنظمة.",
};

export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await getPublicReviews();

  return <ReviewsContent reviews={reviews} />;
}