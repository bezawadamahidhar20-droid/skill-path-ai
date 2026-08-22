"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bell, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";
import type { notifications as notificationsTable } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Notification = InferSelectModel<typeof notificationsTable>;

const DOT_COLOR: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-primary",
};

export function NotificationsClient({ notifications: initial }: { notifications: Notification[] }) {
  const [items, setItems] = useState(initial);

  async function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", { method: "PATCH" });
  }

  async function markRead(id: number) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="h-8 w-8" />}
        title="No notifications yet"
        description="You'll see updates about your readiness score, roadmap tasks and recommendations here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      </div>
      <Card className="p-0">
        <div className="flex flex-col divide-y divide-border">
          {items.map((n) => (
            <motion.button
              key={n.id}
              onClick={() => markRead(n.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-background/60 ${!n.read ? "bg-primary-soft/30" : ""}`}
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-border" : DOT_COLOR[n.type] ?? "bg-primary"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{n.title}</p>
                <p className="mt-0.5 text-sm text-text-secondary">{n.message}</p>
                <p className="mt-1 text-xs text-text-secondary">{formatDateTime(n.createdAt)}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  );
}
