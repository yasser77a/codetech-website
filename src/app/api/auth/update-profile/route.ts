import { NextResponse } from "next/server";
import { getSession, createSession } from "@/lib/auth";
import { users, type User } from "@/lib/users";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await request.json();
  const { fullName, username, role } = body;

  const user = users.find((u: User) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  // ✅ التحقق من الدور
  const isAdmin = user.role === "admin" || user.username === "yasser alashram";

  if (!fullName || !fullName.trim()) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }

  // ✅ تحديث الاسم للجميع
  user.fullName = fullName.trim();

  // ✅ تحديث اسم المستخدم والدور للأدمن فقط
  if (isAdmin) {
    if (username && username.trim()) {
      const exists = users.find(
        (u: User) =>
          u.id !== user.id &&
          u.username.toLowerCase() === username.toLowerCase().trim()
      );
      if (exists) {
        return NextResponse.json(
          { error: "اسم المستخدم مستخدم بالفعل" },
          { status: 400 }
        );
      }
      user.username = username.trim();
    }
    if (role && ["admin", "editor", "viewer"].includes(role)) {
      user.role = role;
    }
  }

  // ✅ تحديث الجلسة
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
}