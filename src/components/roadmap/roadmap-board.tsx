"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Circle, CircleDot, CheckCircle2 } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/card";
import { CATEGORY_LABELS, type Category } from "@/lib/scoring";
import type { roadmapTasks } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type RoadmapTask = InferSelectModel<typeof roadmapTasks>;

const STATUS_CONFIG = {
  not_started: { icon: Circle, label: "Not Started", color: "text-text-secondary" },
  in_progress: { icon: CircleDot, label: "In Progress", color: "text-warning" },
  completed: { icon: CheckCircle2, label: "Completed", color: "text-success" },
} as const;

export function RoadmapBoard({ tasks: initialTasks }: { tasks: RoadmapTask[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [pending, setPending] = useState<number | null>(null);

  const weeks = Array.from(new Set(tasks.map((t) => t.week))).sort((a, b) => a - b);

  async function toggleTask(id: number) {
    setPending(id);
    try {
      const res = await fetch(`/api/roadmap/tasks/${id}/complete`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setTasks((prev) => prev.map((t) => (t.id === id ? json.data : t)));
      }
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {weeks.map((week) => {
        const weekTasks = tasks.filter((t) => t.week === week);
        const completed = weekTasks.filter((t) => t.status === "completed").length;
        const progress = Math.round((completed / weekTasks.length) * 100);

        return (
          <Card key={week}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-text">Week {week}</h3>
              <span className="text-xs font-medium text-text-secondary">
                {completed}/{weekTasks.length} completed
              </span>
            </div>
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex flex-col gap-2">
              {weekTasks.map((task) => {
                const config = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.not_started;
                const Icon = config.icon;
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    disabled={pending === task.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-background/60 disabled:opacity-60"
                  >
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.color}`} />
                    <div>
                      <p className={`text-sm font-medium ${task.status === "completed" ? "text-text-secondary line-through" : "text-text"}`}>
                        {task.title}
                      </p>
                      {task.description ? <p className="mt-0.5 text-xs text-text-secondary">{task.description}</p> : null}
                      <span className="mt-1 inline-block text-[11px] font-medium uppercase tracking-wide text-primary/70">
                        {CATEGORY_LABELS[task.category as Category] ?? task.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
