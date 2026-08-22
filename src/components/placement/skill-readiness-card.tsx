import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSkillLevelTone, type PrioritizedSkill } from "@/lib/skill-classification";
import { ArrowRight, Bot } from "lucide-react";

interface SkillReadinessCardProps {
  skill: PrioritizedSkill;
  onOpenAgent: (agentId: string) => void;
}

export function SkillReadinessCard({ skill, onOpenAgent }: SkillReadinessCardProps) {
  const tone = getSkillLevelTone(skill.level);

  return (
    <Card className={`flex flex-col justify-between p-5 transition-all duration-200 hover:shadow-md ${tone.border}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              {skill.priority}
            </span>
            <h4 className="text-base font-bold text-text leading-snug">{skill.name}</h4>
          </div>

          <Badge tone={tone.badge} className="shrink-0 px-2.5 py-0.5">
            {skill.level}
          </Badge>
        </div>

        <div className="space-y-2.5 text-xs text-text-secondary border-t border-border/50 pt-3">
          <p className="leading-relaxed">
            <strong className="text-text">Why it matters:</strong> {skill.whyItMatters}
          </p>
          <p className="leading-relaxed">
            <strong className="text-primary">Next action:</strong> {skill.whatToDoNext}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Bot className="h-3.5 w-3.5" />
          <span>AI Coach Ready</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenAgent(skill.recommendedAgentId)}
          className="gap-1 hover:border-primary hover:text-primary"
        >
          Work on Skill <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
