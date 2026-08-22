import Link from "next/link";
import { ScoreRing } from "@/components/ui/score-ring";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Award } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PlacementReadinessHeaderProps {
  userName: string;
  targetRole: string;
  readinessScore: number;
  readinessLevel: string;
  lastAssessedDate: Date | string;
  strongAreasCount: number;
  gapsCount: number;
}

export function PlacementReadinessHeader({
  userName,
  targetRole,
  readinessScore,
  readinessLevel,
  lastAssessedDate,
  strongAreasCount,
  gapsCount,
}: PlacementReadinessHeaderProps) {
  const firstName = userName.split(" ")[0];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Target className="h-3.5 w-3.5" />
            <span>Target Role: {targetRole}</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Your preparation plan is focused on becoming interview and application ready for{" "}
              <span className="font-semibold text-text">{targetRole}</span> opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-success" />
              <span>{strongAreasCount} Strong Capabilities</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-warning" />
              <span>{gapsCount} Priority Improvement Areas</span>
            </div>
            <div className="text-text-secondary/70">
              Last Assessed: <span className="text-text">{formatDate(lastAssessedDate)}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/results">
              <Button size="sm">
                View Full Placement Analysis <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <ScoreRing score={readinessScore} size={110} strokeWidth={9} />
          <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Readiness Level
          </p>
          <p className="text-sm font-bold text-primary">{readinessLevel}</p>
        </div>
      </div>
    </div>
  );
}
