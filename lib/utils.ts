import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts up to two initials from a given title.
 * @param name - The title to extract initials from.
 * @returns A string containing up to two initials.
 */
export function getInitials(name: string): string {
  // Split the title into words and filter out empty strings
  const words = name.split(/\s+/).filter((word) => word.trim().length > 0);

  // Get the first character of up to two words
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
