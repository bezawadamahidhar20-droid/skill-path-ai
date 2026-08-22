import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getLatestAssessment, getProfile } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { Card, SectionHeader } from "@/components/ui/card";
import { ScoreBar } from "@/components/ui/score-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillRadar } from "@/components/charts/skill-radar";
import { skillTargetsForRole } from "@/lib/scoring";
import { classifySkillScore, getSkillLevelTone, getRoleSkillPriorities } from "@/lib/skill-classification";
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

  const targetRole = profile?.targetRole ?? assessment.preferredRole ?? "Software Engineer";
  const targets = skillTargetsForRole(targetRole);
  const prioritizedSkills = getRoleSkillPriorities(targetRole, assessment);

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
      <SectionHeader
        title="Skill Intelligence & Diagnosis"
        description={`Evaluated against industry benchmarks for a ${targetRole} role.`}
      />

      {/* Priority Skill Readiness Matrix */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prioritizedSkills.map((ps) => {
          const tone = getSkillLevelTone(ps.level);
          return (
            <Card key={ps.id} className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-text-secondary uppercase">{ps.priority}</span>
                  <Badge tone={tone.badge}>{ps.level}</Badge>
                </div>
                <h4 className="font-bold text-text text-base mt-1">{ps.name}</h4>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">{ps.whyItMatters}</p>
              </div>
              <p className="text-xs font-semibold text-primary mt-3 pt-2 border-t border-border">
                Next: {ps.whatToDoNext}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Skill Radar Benchmark" />
          <SkillRadar data={radarData} />
        </Card>
        <Card>
          <SectionHeader title="Detailed Technical Breakdown" description="Current readiness vs. target benchmark level." />
          <div className="flex flex-col gap-5">
            {skillData.map((s) => {
              const level = classifySkillScore(s.current);
              const tone = getSkillLevelTone(level);
              return (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-bold text-text">{s.skill}</span>
                    <Badge tone={tone.badge}>{level}</Badge>
                  </div>
                  <ScoreBar label="" value={s.current} />
                  <p className="mt-1 text-right text-xs text-text-secondary">Target: {targets[s.skill] ?? 70}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <SectionHeader title="Aptitude & Communication Capabilities" />
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { label: "Quantitative Aptitude", value: assessment.quant },
            { label: "Logical Reasoning", value: assessment.logical },
            { label: "Verbal Ability", value: assessment.verbal },
            { label: "Communication", value: assessment.communication },
            { label: "Interview Confidence", value: assessment.interviewConfidence },
            { label: "Presentation Skills", value: assessment.presentation },
          ].map((item) => {
            const level = classifySkillScore(item.value);
            const tone = getSkillLevelTone(level);
            return (
              <div key={item.label} className="rounded-lg border border-border bg-background p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-text">{item.label}</span>
                  <Badge tone={tone.badge}>{level}</Badge>
                </div>
                <ScoreBar label="" value={item.value} />
              </div>
            );
          })}
        </div>
      </Card>
    </PageTransition>
  );
}
