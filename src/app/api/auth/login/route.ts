// ============================================
// POST /api/auth/login
// ============================================

import { NextResponse } from "next/server";
import { findUser, verifyPassword, updateLastLogin } from "@/lib/users";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: "يرجى إدخال اسم المستخدم وكلمة المرور" },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUser(username);

    if (!user) {
      return NextResponse.json(
        { error: "اسم المستخدم غير صحيح" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: "الحساب معطل، تواصل مع المدير" },
        { status: 403 }
      );
    }

    // Verify password
    const valid = verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // Create session
    await createSession({
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });

    // Update last login
    await updateLastLogin(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}