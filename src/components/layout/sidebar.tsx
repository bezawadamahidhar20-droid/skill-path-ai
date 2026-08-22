"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  ClipboardList,
  Gauge,
  Radar,
  SlidersHorizontal,
  Map,
  BookOpen,
  FileText,
  User,
  Settings,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ClipboardList,
  Gauge,
  Radar,
  SlidersHorizontal,
  Map,
  BookOpen,
  FileText,
  User,
  Settings,
};

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface px-3 py-6 lg:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/20">
          P
        </div>
        <span className="text-lg font-bold tracking-tight text-text">PlacementIQ</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            >
              {active ? (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-xl bg-primary-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              <span
                className={`relative z-10 flex items-center gap-3 ${
                  active ? "text-primary font-semibold" : "text-text-secondary hover:text-text"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </span>
            </Link>
          );
        })}
        {isAdmin ? (
          <Link
            href="/admin"
            className="relative mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
          >
            <ShieldCheck className="h-[18px] w-[18px]" />
            Admin
          </Link>
        ) : null}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
        >
          <HelpCircle className="h-[18px] w-[18px]" />
          Help &amp; Support
        </Link>
      </div>
    </aside>
  );
}
