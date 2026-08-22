import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getRoadmapTasks, getLatestAssessmentWithPrediction, getProfile } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { RoadmapPageClient } from "@/components/placement/roadmap-page-client";
import { Map } from "lucide-react";
import { getRoleSkillPriorities } from "@/lib/skill-classification";
import type { AgentContext } from "@/lib/agents/context";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const user = await requireUser();
  const [tasks, profile, { assessment, prediction }] = await Promise.all([
    getRoadmapTasks(user.id),
    getProfile(user.id),
    getLatestAssessmentWithPrediction(user.id),
  ]);

  const targetRole = profile?.targetRole || assessment?.preferredRole || "Software Engineer";
  const prioritizedSkills = assessment ? getRoleSkillPriorities(targetRole, assessment) : [];

  const agentContext: AgentContext = {
    userId: user.id,
    userName: user.name,
    targetRole,
    readinessScore: prediction?.score ?? 60,
    readinessLevel: prediction?.level ?? "Average",
    priorityGaps: prioritizedSkills
      .filter((s) => s.level === "Below Average" || s.level === "Average")
      .map((s) => ({ skill: s.name, level: s.level, priority: s.priority })),
    activeRoadmapTasks: tasks.map((t) => ({ title: t.title, category: t.category, status: t.status })),
    projectsCount: assessment?.projectsCount ?? 0,
    internshipsCount: assessment?.internshipsCount ?? 0,
  };

  return (
    <PageTransition>
      <SectionHeader
        title="Job-Readiness Employment Roadmap"
        description={`Your adaptive 6-stage milestone path to land a ${targetRole} offer.`}
      />

      {tasks.length === 0 && !assessment ? (
        <EmptyState
          icon={<Map className="h-8 w-8" />}
          title="No roadmap yet"
          description="Complete your first Placement Readiness Assessment to unlock your adaptive job-readiness roadmap."
          action={
            <Link href="/assessment">
              <Button>Start Assessment</Button>
            </Link>
          }
        />
      ) : (
        <RoadmapPageClient targetRole={targetRole} tasks={tasks} agentContext={agentContext} />
      )}
    </PageTransition>
  );
}
