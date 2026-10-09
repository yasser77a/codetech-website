// ============================================
// GET /api/public/reviews
// جلب المراجعات المعتمدة (بدون مصادقة)
// ============================================

import { NextResponse } from "next/server";
import { getPublicReviews } from "@/lib/prisma-queries";

export const revalidate = 60;

export async function GET() {
  try {
    const reviews = await getPublicReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/public/reviews error:", error);
    return NextResponse.json(
      { error: "فشل في جلب المراجعات" },
      { status: 500 }
    );
  }
}