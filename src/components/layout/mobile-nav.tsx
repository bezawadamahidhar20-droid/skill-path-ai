"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { LayoutDashboard, ClipboardList, Gauge, SlidersHorizontal, User } from "lucide-react";
import { MOBILE_NAV_ITEMS } from "@/lib/constants";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ClipboardList,
  Gauge,
  SlidersHorizontal,
  User,
};

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface/95 px-1 py-2 backdrop-blur lg:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon];
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex min-w-[64px] flex-col items-center gap-1 rounded-lg px-2 py-1.5"
          >
            {active ? (
              <motion.div
                layoutId="active-nav-mobile"
                className="absolute inset-0 rounded-lg bg-primary-soft"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : null}
            <span className={`relative z-10 flex flex-col items-center gap-0.5 ${active ? "text-primary" : "text-text-secondary"}`}>
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
