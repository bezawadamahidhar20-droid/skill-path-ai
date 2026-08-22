import { SectionHeader } from "@/components/ui/card";
import { AIAgentCard } from "./ai-agent-card";
import { AI_AGENTS } from "@/lib/agents/definitions";

interface AIAgentCenterProps {
  onOpenAgent: (agentId: string) => void;
}

export function AIAgentCenter({ onOpenAgent }: AIAgentCenterProps) {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="AI Career Preparation Team"
        description="Specialized AI coaches for career strategy, technical skills, resume ATS compliance, and interview mock practice."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AI_AGENTS.map((agent) => (
          <AIAgentCard key={agent.id} agent={agent} onOpen={onOpenAgent} />
        ))}
      </div>
    </div>
  );
}
