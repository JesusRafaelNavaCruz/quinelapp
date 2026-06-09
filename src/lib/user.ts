"use client";
import { nanoid } from "nanoid";
import type { User } from "@/types";

const USER_KEY = "quiniela_user";

const AVATARS = ["⚽", "🏆", "🥅", "🧤", "👟", "🎯", "🔥", "⭐", "🦅", "🐆"];

export function getOrCreateUser(): User {
  if (typeof window === "undefined") throw new Error("Solo disponible en el cliente");

  const stored = localStorage.getItem(USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as User;
    } catch {
      // datos corruptos, crear nuevo
    }
  }

  const user: User = {
    id: nanoid(10),
    name: "",
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    createdAt: Date.now(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return (JSON.parse(stored) as User).id;
  } catch {
    return null;
  }
}

export function updateUserToken(fcmToken: string): void {
  const user = getOrCreateUser();
  saveUser({ ...user, fcmToken });
}
