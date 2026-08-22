"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, SectionHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Bot } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface RoadmapTaskItem {
  id: number;
  week: number;
  title: string;
  category: string;
  description: string | null;
  status: string; // not_started | in_progress | completed
}

interface JobReadinessRoadmapProps {
  targetRole: string;
  tasks: RoadmapTaskItem[];
  onOpenAgent: (agentId: string) => void;
}

export function JobReadinessRoadmap({ targetRole, tasks, onOpenAgent }: JobReadinessRoadmapProps) {
  const router = useRouter();
  const { push } = useToast();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const stages = [
    {
      number: 1,
      title: "Career Target",
      description: `Confirm target role specifications and core benchmarks for ${targetRole}.`,
      category: "Career Strategy",
      recommendedAgent: "career-strategist",
    },
    {
      number: 2,
      title: "Close Critical Skill Gaps",
      description: "Focus practice on your weakest priority technical skill gaps.",
      category: "Skill Development",
      recommendedAgent: "skill-coach",
    },
    {
      number: 3,
      title: "Build Proof of Skill",
      description: "Deploy production projects with clean documentation & GitHub evidence.",
      category: "Proof of Skill",
      recommendedAgent: "dsa-coach",
    },
    {
      number: 4,
      title: "Resume Readiness",
      description: "Optimize project bullet points, keywords, and ATS screening structure.",
      category: "Resume & Portfolio",
      recommendedAgent: "resume-agent",
    },
    {
      number: 5,
      title: "Interview Readiness",
      description: "Prepare structured STAR-method responses for Technical, HR & Behavioral rounds.",
      category: "Interview Preparation",
      recommendedAgent: "interview-coach",
    },
    {
      number: 6,
      title: "Application Readiness",
      description: "Match job descriptions, request referrals, and track active placement drives.",
      category: "Application Strategy",
      recommendedAgent: "application-coach",
    },
  ];

  async function handleToggleStatus(taskId: number, currentStatus: string) {
    setUpdatingId(taskId);
    const newStatus = currentStatus === "completed" ? "not_started" : "completed";
    try {
      const res = await fetch("/api/roadmap/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        push({ title: "Task Updated", description: `Marked as ${newStatus === "completed" ? "Completed" : "Not Started"}.`, tone: "success" });
        router.refresh();
      }
    } catch {
      push({ title: "Update Failed", description: "Could not update task status.", tone: "danger" });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="border-b border-border pb-5 mb-6">
        <SectionHeader
          title="Job-Readiness Employment Roadmap"
          description="A structured 6-stage timeline guiding you from skill diagnosis to placement offers."
        />
      </div>

      <div className="relative space-y-6 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-border/60">
        {stages.map((stage) => {
          const stageTasks = tasks.filter(
            (t) => t.category.toLowerCase().includes(stage.category.toLowerCase()) || (stage.number === 1 && t.week === 1)
          );

          const completedCount = stageTasks.filter((t) => t.status === "completed").length;
          const isStageDone = stageTasks.length > 0 && completedCount === stageTasks.length;

          return (
            <div key={stage.number} className="relative pl-12">
              <div
                className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                  isStageDone
                    ? "border-success bg-success text-white"
                    : "border-primary bg-primary-soft text-primary"
                }`}
              >
                {isStageDone ? <CheckCircle2 className="h-4 w-4" /> : stage.number}
              </div>

              <div className="rounded-xl border border-border/80 bg-muted/30 p-4 sm:p-5">
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-text">Stage {stage.number} — {stage.title}</h4>
                    <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">{stage.description}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenAgent(stage.recommendedAgent)}
                    className="shrink-0 gap-1.5 text-xs hover:border-primary hover:text-primary"
                  >
                    <Bot className="h-3.5 w-3.5" /> Stage AI Coach
                  </Button>
                </div>

                {stageTasks.length > 0 ? (
                  <div className="mt-4 space-y-2 border-t border-border/50 pt-3">
                    {stageTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-surface p-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={updatingId === task.id}
                            onClick={() => handleToggleStatus(task.id, task.status)}
                            className="text-text-secondary hover:text-primary transition-colors"
                          >
                            {task.status === "completed" ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                            ) : task.status === "in_progress" ? (
                              <Clock className="h-4.5 w-4.5 text-warning" />
                            ) : (
                              <Circle className="h-4.5 w-4.5 text-text-secondary/50" />
                            )}
                          </button>
                          <div>
                            <span
                              className={`font-semibold ${
                                task.status === "completed" ? "line-through text-text-secondary" : "text-text"
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.description ? (
                              <p className="mt-0.5 text-[11px] text-text-secondary leading-relaxed">{task.description}</p>
                            ) : null}
                          </div>
                        </div>

                        <Badge
                          tone={
                            task.status === "completed"
                              ? "success"
                              : task.status === "in_progress"
                              ? "warning"
                              : "info"
                          }
                          className="shrink-0 text-[10px]"
                        >
                          {task.status === "completed"
                            ? "Completed"
                            : task.status === "in_progress"
                            ? "In Progress"
                            : "Recommended"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-text-secondary italic">
                    No active tasks assigned to this stage yet. Consult the Stage AI Coach to generate custom tasks.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
