// ============================================
// GET /api/auth/me
// ============================================

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findUserById } from "@/lib/users";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    const user = await findUserById(session.userId);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "المستخدم غير موجود أو معطل" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}