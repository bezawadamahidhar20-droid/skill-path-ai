import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Topbar } from "@/components/layout/topbar";
import { DesktopTopbar } from "@/components/layout/desktop-topbar";

export function AppShell({
  children,
  name,
  role,
  unreadCount = 0,
}: {
  children: ReactNode;
  name: string;
  role: string;
  unreadCount?: number;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin={role === "admin"} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar name={name} unreadCount={unreadCount} />
        <DesktopTopbar name={name} role={role} unreadCount={unreadCount} />
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
