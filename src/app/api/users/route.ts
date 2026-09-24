import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";
import { users, type User } from "@/lib/users";

// GET: جلب المستخدمين
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const safeUsers = users.map((u: User) => ({
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    role: u.role,
    createdAt: u.createdAt,
  }));

  return NextResponse.json({ users: safeUsers });
}

// POST: إضافة مستخدم جديد
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  // فقط الأدمن يمكنه الإضافة
  const currentUser = users.find((u: User) => u.id === session.userId);
  const isAdmin =
    currentUser?.role === "admin" ||
    currentUser?.username === "yasser alashram";

  if (!isAdmin) {
    return NextResponse.json(
      { error: "ليس لديك صلاحيات لإضافة مستخدمين" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { fullName, username, password, role } = body;

  // التحقق من البيانات
  if (!fullName?.trim()) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }
  if (!username?.trim()) {
    return NextResponse.json({ error: "اسم المستخدم مطلوب" }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
      { status: 400 }
    );
  }

  // التحقق من عدم التكرار
  const exists = users.find(
    (u: User) => u.username.toLowerCase() === username.toLowerCase().trim()
  );
  if (exists) {
    return NextResponse.json(
      { error: "اسم المستخدم مستخدم بالفعل" },
      { status: 400 }
    );
  }

  // إنشاء المستخدم
  const newUser: User = {
    id: `user-${Date.now()}`,
    username: username.trim(),
    fullName: fullName.trim(),
    password: bcrypt.hashSync(password, 10),
    role: role || "viewer",
    createdAt: new Date(),
  };

  users.push(newUser);

  return NextResponse.json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      fullName: newUser.fullName,
      role: newUser.role,
      createdAt: newUser.createdAt,
    },
  });
}