"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, LogOut } from "lucide-react";

export function Topbar({
  name,
  unreadCount,
}: {
  name: string;
  unreadCount: number;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-30 flex items-center justify-end gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:hidden">
      <Link href="/notifications" className="relative rounded-xl p-2.5 text-text-secondary hover:bg-muted" aria-label="Notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Link>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="rounded-xl p-2.5 text-text-secondary hover:bg-muted"
        aria-label="Log out"
      >
        <LogOut className="h-5 w-5" />
      </button>
      <span className="text-sm font-semibold text-text">{name}</span>
    </div>
  );
}
