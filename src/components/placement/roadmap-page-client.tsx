"use client";

import { useState } from "react";
import { JobReadinessRoadmap, type RoadmapTaskItem } from "./job-readiness-roadmap";
import { AIAgentWorkspace } from "./ai-agent-workspace";
import type { AgentContext } from "@/lib/agents/context";

interface RoadmapPageClientProps {
  targetRole: string;
  tasks: RoadmapTaskItem[];
  agentContext: AgentContext;
}

export function RoadmapPageClient({ targetRole, tasks, agentContext }: RoadmapPageClientProps) {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <JobReadinessRoadmap
        targetRole={targetRole}
        tasks={tasks}
        onOpenAgent={(agentId) => setActiveAgentId(agentId)}
      />

      {activeAgentId ? (
        <AIAgentWorkspace
          initialAgentId={activeAgentId}
          userContext={agentContext}
          onClose={() => setActiveAgentId(null)}
        />
      ) : null}
    </div>
  );
}
