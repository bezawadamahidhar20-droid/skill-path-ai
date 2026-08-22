import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, getUnreadNotificationCount } from "@/lib/data";
import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/components/layout/providers";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(user.id);

  if (!profile?.onboardingCompleted) {
    redirect("/onboarding");
  }

  const unreadCount = await getUnreadNotificationCount(user.id);

  return (
    <Providers>
      <AppShell name={user.name} role={user.role} unreadCount={unreadCount}>
        {children}
      </AppShell>
    </Providers>
  );
}
