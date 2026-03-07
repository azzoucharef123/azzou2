import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(dateString));
}

export function formatShortDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

export function calculateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(4, Math.ceil(words / 220));
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
