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
      return { text: "text-[#A44C4C]", bg: "bg-[#A44C4C]/10", dot: "bg-[#A44C4C]" };
    case "warning":
      return { text: "text-[#9A6A27]", bg: "bg-[#9A6A27]/10", dot: "bg-[#9A6A27]" };
    case "success":
      return { text: "text-[#3F6B46]", bg: "bg-[#3F6B46]/10", dot: "bg-[#3F6B46]" };
    default:
      return { text: "text-[#7D4047]", bg: "bg-[#F3E8EA]", dot: "bg-[#7D4047]" };
  }
}
