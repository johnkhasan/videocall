import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomId(): string {
  // 4-digit numeric room code, e.g. '4829'
  return Math.floor(1000 + Math.random() * 9000).toString();
}
