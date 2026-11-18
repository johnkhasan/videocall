import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomId(): string {
  // Generate human-friendly Apple FaceTime style room ID: e.g., 'cal-849-219' or 'apple-meet-abc'
  const randomChars = (len: number) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let res = "";
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  return `${randomChars(3)}-${randomChars(4)}-${randomChars(3)}`;
}
