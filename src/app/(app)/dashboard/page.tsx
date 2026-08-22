import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getLatestAssessmentWithPrediction, getProfile, getRoadmapTasks } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { DashboardCommandCenter } from "@/components/placement/dashboard-command-center";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { getRoleSkillPriorities } from "@/lib/skill-classification";
import type { AgentContext } from "@/lib/agents/context";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const { assessment, prediction } = await getLatestAssessmentWithPrediction(user.id);
  const tasks = await getRoadmapTasks(user.id);

  if (!assessment || !prediction) {
    return (
      <PageTransition>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Welcome, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Let&apos;s evaluate your current placement readiness.
          </p>
        </div>
        <EmptyState
          icon={<Sparkles className="h-8 w-8" />}
          title="No assessment completed yet"
          description="Complete your initial Placement Readiness Assessment to generate your job-readiness roadmap, skill gaps, and AI coaching team."
          action={
            <Link href="/assessment">
              <Button>Start Assessment</Button>
            </Link>
          }
        />
      </PageTransition>
    );
  }

  const targetRole = profile?.targetRole || assessment.preferredRole || "Software Engineer";
  const prioritizedSkills = getRoleSkillPriorities(targetRole, assessment);

  const agentContext: AgentContext = {
    userId: user.id,
    userName: user.name,
    targetRole,
    readinessScore: prediction.score,
    readinessLevel: prediction.level,
    priorityGaps: prioritizedSkills
      .filter((s) => s.level === "Below Average" || s.level === "Average")
      .map((s) => ({ skill: s.name, level: s.level, priority: s.priority })),
    activeRoadmapTasks: tasks.map((t) => ({ title: t.title, category: t.category, status: t.status })),
    projectsCount: assessment.projectsCount,
    internshipsCount: assessment.internshipsCount,
  };

  return (
    <PageTransition>
      <DashboardCommandCenter
        userName={user.name}
        targetRole={targetRole}
        readinessScore={prediction.score}
        readinessLevel={prediction.level}
        lastAssessedDate={assessment.createdAt}
        prioritizedSkills={prioritizedSkills}
        roadmapTasks={tasks}
        agentContext={agentContext}
      />
    </PageTransition>
  );
}
