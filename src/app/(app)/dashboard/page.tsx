import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getLatestAssessmentWithPrediction, getAssessmentHistory, getProfile } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger";
import { Card, SectionHeader } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreBar } from "@/components/ui/score-bar";
import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendChart } from "@/components/charts/trend-chart";
import { toneClasses, formatDate } from "@/lib/utils";
import { CATEGORY_LABELS, type Category } from "@/lib/scoring";
import { ArrowRight, ClipboardList, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const { assessment, prediction } = await getLatestAssessmentWithPrediction(user.id);
  const history = await getAssessmentHistory(user.id);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user.name.split(" ")[0];

  if (!assessment || !prediction) {
    return (
      <PageTransition>
        <SectionHeader title={`${greeting}, ${firstName}`} description="Here's your placement readiness snapshot." />
        <EmptyState
          icon={<Sparkles className="h-8 w-8" />}
          title="No assessment yet"
          description="Complete your first Placement Readiness Assessment to understand where you currently stand."
          action={
            <Link href="/assessment">
              <Button>Start Assessment</Button>
            </Link>
          }
        />
      </PageTransition>
    );
  }

  const previousScore = history.length > 1 ? history[history.length - 2]?.score : null;
  const delta = previousScore !== null && previousScore !== undefined ? prediction.score - previousScore : null;
  const tone = toneClasses(
    prediction.score >= 75 ? "success" : prediction.score >= 60 ? "primary" : prediction.score >= 40 ? "warning" : "danger",
  );

  const breakdown = prediction.breakdown as Record<Category, number>;
  const topActions = prediction.recommendations.slice(0, 3);

  return (
    <PageTransition>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">Here&apos;s your placement readiness snapshot.</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-text-secondary">Last assessed</p>
          <p className="font-medium text-text">{formatDate(assessment.createdAt)}</p>
        </div>
      </div>

      <StaggerContainer className="flex flex-col gap-6">
        <StaggerItem>
          <Card className="overflow-hidden bg-gradient-to-br from-surface to-primary-soft/40 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Your Placement Readiness</p>
                <div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
                  <span className={`inline-flex h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                  <span className={`text-sm font-semibold ${tone.text}`}>{prediction.level}</span>
                </div>
                {delta !== null ? (
                  <p className="mt-2 text-sm font-medium text-text-secondary">
                    {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)} points from your last assessment
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-text-secondary">Your baseline readiness score</p>
                )}
                <div className="mt-5">
                  <Link href="/results">
                    <Button>
                      View Detailed Analysis <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <ScoreRing score={prediction.score} />
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card>
            <SectionHeader title="Readiness Breakdown" description="Click a category to explore a detailed skill analysis." />
            <div className="grid gap-5 sm:grid-cols-2">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                <ScoreBar key={cat} label={CATEGORY_LABELS[cat]} value={breakdown[cat] ?? 0} />
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Link href="/skills" className="text-sm font-medium text-primary hover:underline">
                Open Skill Intelligence →
              </Link>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard label="CGPA" value={Number(assessment.cgpa)} decimals={1} helper={`Branch: ${assessment.branch}`} />
            <MetricCard label="Coding" value={assessment.codingScore} helper="Overall coding score" />
            <MetricCard label="Projects" value={assessment.projectsCount} helper="Completed projects" />
            <MetricCard label="Internships" value={assessment.internshipsCount} helper={assessment.internshipsCount > 0 ? "Strong" : "Add one soon"} />
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionHeader title="Readiness Trend" description="Your score across previous assessments." />
              <TrendChart data={history.map((h) => ({ createdAt: String(h.createdAt), score: h.score }))} />
            </Card>
            <Card>
              <SectionHeader title="Your Strengths" />
              <ul className="flex flex-col gap-2">
                {prediction.positiveFactors.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text">
                    <Badge tone="success">✓</Badge> {f}
                  </li>
                ))}
              </ul>
              <div className="my-4 h-px bg-border" />
              <SectionHeader title="Focus Areas" />
              <ol className="flex flex-col gap-2">
                {prediction.improvementFactors.map((f, i) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    {f}
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </StaggerItem>

        <StaggerItem>
          <Card>
            <SectionHeader
              title="Your next best actions"
              description={`Based on your ${profile?.targetRole ?? "target"} goal and current profile.`}
            />
            <div className="flex flex-col divide-y divide-border">
              {topActions.map((action) => (
                <Link
                  key={action.title}
                  href="/roadmap"
                  className="flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:bg-background/60"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    <span className="font-medium text-text">{action.title}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-secondary" />
                </Link>
              ))}
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
