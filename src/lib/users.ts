// مؤقت - سنستبدله بـ Prisma لاحقاً
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  username: string;
  fullName: string;
  password: string; // hashed
  role: "admin" | "editor" | "viewer";
  avatar?: string;
  createdAt: Date;
}

// كلمة مرور افتراضية: CodeTech@2026
// يمكنك تغييرها لاحقاً من صفحة الإعدادات
const DEFAULT_PASSWORD = "CodeTech@2026";
const hashedPassword = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

export const users: User[] = [
  {
    id: "1",
    username: "yasser alashram",
    fullName: "ياسر الأشرم",
    password: hashedPassword,
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
];

export function findUser(username: string): User | undefined {
  return users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase().trim()
  );
}

export function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

export function updatePassword(userId: string, newPassword: string): boolean {
  const user = users.find((u) => u.id === userId);
  if (!user) return false;
  user.password = bcrypt.hashSync(newPassword, 10);
  return true;
}
