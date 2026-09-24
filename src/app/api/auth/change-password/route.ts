import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updatePassword, users } from "@/lib/users";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
      { status: 400 }
    );
  }

  const user = users.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  const { verifyPassword } = await import("@/lib/users");
  if (!verifyPassword(currentPassword, user.password)) {
    return NextResponse.json(
      { error: "كلمة المرور الحالية غير صحيحة" },
      { status: 401 }
    );
  }

  updatePassword(user.id, newPassword);

  return NextResponse.json({ success: true });
}