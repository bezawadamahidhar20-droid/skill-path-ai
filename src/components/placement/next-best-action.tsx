import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, AlertCircle } from "lucide-react";
import type { PrioritizedSkill } from "@/lib/skill-classification";

interface NextBestActionProps {
  topSkill: PrioritizedSkill;
  onOpenAgent: (agentId: string) => void;
}

export function NextBestAction({ topSkill, onOpenAgent }: NextBestActionProps) {
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-primary/[0.02] to-surface p-6 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
            <Zap className="h-3 w-3" />
            <span>Your Next Best Action</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-text sm:text-2xl">
            Strengthen {topSkill.name}
          </h3>

          <p className="text-sm text-text-secondary leading-relaxed">
            Your current evaluation is{" "}
            <span className="inline-flex items-center gap-1 font-bold text-danger">
              <AlertCircle className="h-3 w-3" />
              {topSkill.level}
            </span>
            . {topSkill.whyItMatters}
          </p>

          <p className="text-xs font-medium text-text-secondary">
            <span className="font-bold text-primary">Recommended Next Step:</span>{" "}
            <span className="text-text">{topSkill.whatToDoNext}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2.5 sm:items-end">
          <Button size="lg" className="w-full sm:w-auto gap-2" onClick={() => onOpenAgent(topSkill.recommendedAgentId)}>
            Start Now <ArrowRight className="h-4 w-4" />
          </Button>
          <span className="text-[11px] font-medium text-text-secondary text-right">Opens specialized AI Coach</span>
        </div>
      </div>
    </Card>
  );
}
