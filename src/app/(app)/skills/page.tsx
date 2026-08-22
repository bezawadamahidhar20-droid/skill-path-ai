import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getLatestAssessment, getProfile } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { Card, SectionHeader } from "@/components/ui/card";
import { ScoreBar } from "@/components/ui/score-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { SkillRadar } from "@/components/charts/skill-radar";
import { skillTargetsForRole } from "@/lib/scoring";
import { Radar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const user = await requireUser();
  const [assessment, profile] = await Promise.all([getLatestAssessment(user.id), getProfile(user.id)]);

  if (!assessment) {
    return (
      <PageTransition>
        <SectionHeader title="Skill Intelligence" description="Your current technical profile" />
        <EmptyState
          icon={<Radar className="h-8 w-8" />}
          title="No assessment yet"
          description="Complete an assessment to unlock your personalized skill intelligence report."
          action={
            <Link href="/assessment">
              <Button>Start Assessment</Button>
            </Link>
          }
        />
      </PageTransition>
    );
  }

  const targets = skillTargetsForRole(profile?.targetRole ?? assessment.preferredRole);
  const skillData = [
    { skill: "Coding", current: assessment.codingScore },
    { skill: "DSA", current: assessment.dsa },
    { skill: "Algorithms", current: assessment.algorithms },
    { skill: "SQL", current: assessment.sqlScore },
    { skill: "Web Development", current: assessment.webDev },
    { skill: "Git/GitHub", current: assessment.gitScore },
  ];
  const radarData = skillData.map((s) => ({ ...s, target: targets[s.skill] ?? 70 }));

  return (
    <PageTransition>
      <SectionHeader title="Skill Intelligence" description={`Your current technical profile for a ${profile?.targetRole ?? assessment.preferredRole} role.`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Skill Radar" />
          <SkillRadar data={radarData} />
        </Card>
        <Card>
          <SectionHeader title="Skill Gap Analysis" description="Your skill vs. the target level for your chosen role." />
          <div className="flex flex-col gap-5">
            {skillData.map((s) => (
              <div key={s.skill}>
                <ScoreBar label={s.skill} value={s.current} />
                <p className="mt-1 text-right text-xs text-text-secondary">Target for role: {targets[s.skill] ?? 70}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <SectionHeader title="Aptitude & Communication" />
        <div className="grid gap-5 sm:grid-cols-2">
          <ScoreBar label="Quantitative Aptitude" value={assessment.quant} />
          <ScoreBar label="Logical Reasoning" value={assessment.logical} />
          <ScoreBar label="Verbal Ability" value={assessment.verbal} />
          <ScoreBar label="Communication" value={assessment.communication} />
          <ScoreBar label="Interview Confidence" value={assessment.interviewConfidence} />
          <ScoreBar label="Presentation Skills" value={assessment.presentation} />
        </div>
      </Card>
    </PageTransition>
  );
}
