import { NextResponse } from "next/server";
import { findUser, verifyPassword } from "@/lib/users";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "يرجى إدخال اسم المستخدم وكلمة المرور" },
        { status: 400 }
      );
    }

    const user = findUser(username);

    if (!user) {
      return NextResponse.json(
        { error: "اسم المستخدم غير صحيح" },
        { status: 401 }
      );
    }

    const valid = verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    await createSession({
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}