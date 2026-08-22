export interface AgentContext {
  userId: number;
  userName: string;
  targetRole: string;
  readinessScore: number;
  readinessLevel: string;
  priorityGaps: Array<{ skill: string; level: string; priority: string }>;
  activeRoadmapTasks: Array<{ title: string; category: string; status: string }>;
  projectsCount: number;
  internshipsCount: number;
}

export function buildAgentContextSummary(ctx: AgentContext): string {
  const gapsStr = ctx.priorityGaps.length
    ? ctx.priorityGaps.map((g) => `${g.skill} (${g.level} - ${g.priority})`).join(", ")
    : "None identified";

  const tasksStr = ctx.activeRoadmapTasks.length
    ? ctx.activeRoadmapTasks.map((t) => `"${t.title}" [${t.status}]`).join(", ")
    : "No active tasks";

  return `STUDENT CONTEXT:
- Name: ${ctx.userName}
- Target Role: ${ctx.targetRole}
- Overall Readiness Score: ${ctx.readinessScore}/100 (${ctx.readinessLevel})
- Priority Skill Gaps: ${gapsStr}
- Active Roadmap Tasks: ${tasksStr}
- Portfolio: ${ctx.projectsCount} projects, ${ctx.internshipsCount} internships`;
}
