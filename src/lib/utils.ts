import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function toneForScore(score: number): "danger" | "warning" | "success" | "primary" {
  if (score >= 75) return "success";
  if (score >= 60) return "primary";
  if (score >= 40) return "warning";
  return "danger";
}

export function toneClasses(tone: "danger" | "warning" | "success" | "primary") {
  switch (tone) {
    case "danger":
      return { text: "text-danger", bg: "bg-danger/10", dot: "bg-danger" };
    case "warning":
      return { text: "text-warning", bg: "bg-warning/10", dot: "bg-warning" };
    case "success":
      return { text: "text-success", bg: "bg-success/10", dot: "bg-success" };
    default:
      return { text: "text-primary", bg: "bg-primary-soft", dot: "bg-primary" };
  }
}
