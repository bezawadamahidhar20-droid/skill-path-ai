"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, LogOut } from "lucide-react";

export function DesktopTopbar({ name, role, unreadCount }: { name: string; role: string; unreadCount: number }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-30 hidden items-center justify-end gap-4 border-b border-border bg-background/80 px-6 py-3 backdrop-blur lg:flex">
      <Link href="/notifications" className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface" aria-label="Notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Link>
      <div className="flex items-center gap-2 border-l border-border pl-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium text-text">{name}</p>
          <p className="text-xs capitalize text-text-secondary">{role.replace("_", " ")}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="ml-2 rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface"
          aria-label="Log out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
