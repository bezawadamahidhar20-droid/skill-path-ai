import { requirePageUser } from "@/lib/auth";
import { getNotifications } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { SectionHeader } from "@/components/ui/card";
import { NotificationsClient } from "@/components/notifications/notifications-client";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requirePageUser();
  const notifications = await getNotifications(user.id);

  return (
    <PageTransition>
      <SectionHeader title="Notifications" description="Stay up to date with your readiness progress." />
      <NotificationsClient notifications={notifications} />
    </PageTransition>
  );
}
