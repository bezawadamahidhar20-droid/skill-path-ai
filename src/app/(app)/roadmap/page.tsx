import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getRoadmapTasks, getLatestAssessment } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { RoadmapBoard } from "@/components/roadmap/roadmap-board";
import { Map } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const user = await requireUser();
  const [tasks, assessment] = await Promise.all([getRoadmapTasks(user.id), getLatestAssessment(user.id)]);

  return (
    <PageTransition>
      <SectionHeader title="Career Roadmap" description="A personalized, week-by-week plan based on your weakest readiness factors." />
      {tasks.length === 0 ? (
        <EmptyState
          icon={<Map className="h-8 w-8" />}
          title="No roadmap yet"
          description={
            assessment
              ? "Your roadmap will be generated automatically after your next assessment."
              : "Complete your first assessment to generate a personalized roadmap."
          }
          action={
            <Link href="/assessment">
              <Button>{assessment ? "Retake Assessment" : "Start Assessment"}</Button>
            </Link>
          }
        />
      ) : (
        <RoadmapBoard tasks={tasks} />
      )}
    </PageTransition>
  );
}
