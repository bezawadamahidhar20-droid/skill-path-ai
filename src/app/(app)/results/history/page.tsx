import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAssessmentHistory } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { Card, SectionHeader } from "@/components/ui/card";
import { TrendChart } from "@/components/charts/trend-chart";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime, toneForScore } from "@/lib/utils";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ResultsHistoryPage() {
  const user = await requireUser();
  const history = await getAssessmentHistory(user.id);

  return (
    <PageTransition>
      <SectionHeader title="Assessment History" description="Every assessment you've completed, preserved for progress tracking." />
      {history.length === 0 ? (
        <EmptyState
          icon={<History className="h-8 w-8" />}
          title="No history yet"
          description="Complete your first assessment to start building your readiness history."
        />
      ) : (
        <div className="flex flex-col gap-6">
          <Card>
            <SectionHeader title="Readiness Trend" />
            <TrendChart data={history.map((h) => ({ createdAt: String(h.createdAt), score: h.score }))} />
          </Card>
          <Card>
            <div className="flex flex-col divide-y divide-border">
              {[...history].reverse().map((h) => (
                <Link
                  key={h.id}
                  href="/results"
                  className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-background/60"
                >
                  <div>
                    <p className="text-sm font-medium text-text">{formatDateTime(h.createdAt)}</p>
                    <p className="text-xs text-text-secondary">{h.level}</p>
                  </div>
                  <Badge tone={toneForScore(h.score ?? 0)}>{h.score}/100</Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      )}
    </PageTransition>
  );
}
