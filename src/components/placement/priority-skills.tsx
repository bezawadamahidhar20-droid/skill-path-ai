import { SectionHeader } from "@/components/ui/card";
import { SkillReadinessCard } from "./skill-readiness-card";
import type { PrioritizedSkill } from "@/lib/skill-classification";

interface PrioritySkillsProps {
  skills: PrioritizedSkill[];
  targetRole: string;
  onOpenAgent: (agentId: string) => void;
}

export function PrioritySkills({ skills, targetRole, onOpenAgent }: PrioritySkillsProps) {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Priority Skill Readiness"
        description={`Ordered by placement importance for your target role: ${targetRole}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillReadinessCard key={skill.id} skill={skill} onOpenAgent={onOpenAgent} />
        ))}
      </div>
    </div>
  );
}
