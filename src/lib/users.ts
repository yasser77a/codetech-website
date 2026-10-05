// ============================================
// CodeTech Website - Users Service (Prisma)
// ============================================

import bcrypt from "bcryptjs";
import { prisma } from "./db";
import type { Role } from "@prisma/client";

// ============================================
// Types
// ============================================
export interface SafeUser {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  role: Role;
  avatar: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

// ============================================
// Find user by username (for login)
// ============================================
export async function findUser(username: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username.trim(),
          mode: "insensitive",
        },
      },
    });
    return user;
  } catch (error) {
    console.error("findUser error:", error);
    return null;
  }
}

// ============================================
// Find user by ID
// ============================================
export async function findUserById(id: string): Promise<SafeUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("findUserById error:", error);
    return null;
  }
}

// ============================================
// Verify password
// ============================================
export function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): boolean {
  try {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  } catch (error) {
    console.error("verifyPassword error:", error);
    return false;
  }
}

// ============================================
// Hash password (for creating/updating)
// ============================================
export function hashPassword(plainPassword: string): string {
  return bcrypt.hashSync(plainPassword, 10);
}

// ============================================
// Update password
// ============================================
export async function updatePassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  try {
    const hashed = hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    return true;
  } catch (error) {
    console.error("updatePassword error:", error);
    return false;
  }
}

// ============================================
// Update last login time
// ============================================
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  } catch (error) {
    console.error("updateLastLogin error:", error);
  }
}

// ============================================
// Get all users (for admin)
// ============================================
export async function getAllUsers(): Promise<SafeUser[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return users;
  } catch (error) {
    console.error("getAllUsers error:", error);
    return [];
  }
}

// ============================================
// Create user
// ============================================
export async function createUser(data: {
  username: string;
  fullName: string;
  email?: string;
  password: string;
  role?: Role;
}): Promise<SafeUser | null> {
  try {
    const user = await prisma.user.create({
      data: {
        username: data.username.trim(),
        fullName: data.fullName,
        email: data.email,
        password: hashPassword(data.password),
        role: data.role || "VIEWER",
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("createUser error:", error);
    return null;
  }
}

// ============================================
// Delete user
// ============================================
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await prisma.user.delete({ where: { id: userId } });
    return true;
  } catch (error) {
    console.error("deleteUser error:", error);
    return false;
  }
}