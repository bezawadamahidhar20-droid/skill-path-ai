import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import type { PrioritizedSkill } from "@/lib/skill-classification";

interface NextBestActionProps {
  topSkill: PrioritizedSkill;
  onOpenAgent: (agentId: string) => void;
}

export function NextBestAction({ topSkill, onOpenAgent }: NextBestActionProps) {
  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-r from-primary-soft/50 via-surface to-surface p-6 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
            <Zap className="h-3 w-3" />
            <span>Your Next Best Action</span>
          </div>

          <h3 className="text-xl font-bold text-text sm:text-2xl">
            Strengthen {topSkill.name}
          </h3>

          <p className="text-sm text-text-secondary leading-relaxed">
            Your current evaluation is <span className="font-semibold text-danger">{topSkill.level}</span>.{" "}
            {topSkill.whyItMatters}
          </p>

          <p className="text-xs font-medium text-text">
            <span className="font-semibold text-primary">Recommended Next Step:</span> {topSkill.whatToDoNext}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 sm:items-end">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => onOpenAgent(topSkill.recommendedAgentId)}>
            Start Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <span className="text-xs text-text-secondary">Opens specialized AI Coach</span>
        </div>
      </div>
    </Card>
  );
}
