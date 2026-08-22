import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getLatestAssessment } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger";
import { Card, SectionHeader } from "@/components/ui/card";
import { ScoreBar } from "@/components/ui/score-bar";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const SECTION_META = [
  { key: "dsa", title: "DSA", total: 100, unit: "problems" },
  { key: "aptitude", title: "Aptitude", total: 60, unit: "mock tests" },
  { key: "technical", title: "Technical Interview", total: 10, unit: "mock rounds" },
  { key: "hr", title: "HR Interview", total: 5, unit: "mock rounds" },
  { key: "communication", title: "Communication", total: 8, unit: "sessions" },
  { key: "resume", title: "Resume", total: 3, unit: "reviews" },
  { key: "gd", title: "Group Discussion", total: 4, unit: "sessions" },
  { key: "mock", title: "Mock Interviews", total: 6, unit: "interviews" },
] as const;

export default async function PrepPage() {
  const user = await requireUser();
  const assessment = await getLatestAssessment(user.id);

  // Derive a deterministic, believable "completed" count per section from the
  // student's assessment scores (no assessment yet -> everything starts at 0).
  const scoreFor = (key: string) => {
    if (!assessment) return 0;
    switch (key) {
      case "dsa":
        return Math.round(((assessment.dsa + assessment.algorithms) / 2 / 100) * 100);
      case "aptitude":
        return Math.round(((assessment.quant + assessment.logical + assessment.verbal) / 3 / 100) * 60);
      case "technical":
        return Math.round((assessment.codingScore / 100) * 10);
      case "hr":
        return Math.round((assessment.interviewConfidence / 100) * 5);
      case "communication":
        return Math.round((assessment.communication / 100) * 8);
      case "resume":
        return Math.round((assessment.presentation / 100) * 3);
      case "gd":
        return Math.round((assessment.communication / 100) * 4);
      case "mock":
        return Math.round((assessment.interviewConfidence / 100) * 6);
      default:
        return 0;
    }
  };

  return (
    <PageTransition>
      <SectionHeader title="Placement Preparation Center" description="Track your practice across every dimension of placement readiness." />
      <StaggerContainer className="grid gap-4 sm:grid-cols-2">
        {SECTION_META.map((section) => {
          const completed = scoreFor(section.key);
          const pct = Math.min(100, Math.round((completed / section.total) * 100));
          return (
            <StaggerItem key={section.key}>
              <Card>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-text">{section.title}</h3>
                  <span className="text-xs font-medium text-text-secondary">
                    {completed} / {section.total} {section.unit}
                  </span>
                </div>
                <div className="mt-3">
                  <ScoreBar label="Progress" value={pct} />
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href="/roadmap">
                    <Button variant="secondary" size="sm">
                      Continue Practice →
                    </Button>
                  </Link>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageTransition>
  );
}
