import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { users, type User } from "@/lib/users";

// DELETE: حذف مستخدم
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const currentUser = users.find((u: User) => u.id === session.userId);
  const isAdmin =
    currentUser?.role === "admin" ||
    currentUser?.username === "yasser alashram";

  if (!isAdmin) {
    return NextResponse.json({ error: "ليس لديك صلاحيات" }, { status: 403 });
  }

  const { id } = await params;

  // لا يمكن حذف نفسك
  if (id === session.userId) {
    return NextResponse.json(
      { error: "لا يمكنك حذف حسابك الخاص" },
      { status: 400 }
    );
  }

  const index = users.findIndex((u: User) => u.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  users.splice(index, 1);

  return NextResponse.json({ success: true });
}