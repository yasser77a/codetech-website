import ReviewsManager from "@/components/admin/ReviewsManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة التقييمات",
};

export default function ReviewsPage() {
  return <ReviewsManager />;
}