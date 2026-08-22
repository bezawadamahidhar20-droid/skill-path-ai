import { requirePageUser } from "@/lib/auth";
import { getLatestAssessment } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { SimulatorClient } from "@/components/simulator/simulator-client";
import { Sliders } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SimulatorPage() {
  const user = await requirePageUser();
  const assessment = await getLatestAssessment(user.id);

  if (!assessment) {
    return (
      <PageTransition>
        <SectionHeader title="What-If Simulator" description="See how improving your profile could affect your placement readiness." />
        <EmptyState
          icon={<Sliders className="h-8 w-8" />}
          title="No assessment yet"
          description="Complete your first assessment so we can simulate improvements to your profile."
          action={
            <Link href="/assessment">
              <Button>Start Assessment</Button>
            </Link>
          }
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SectionHeader title="What-If Simulator" description="See how improving your profile could affect your placement readiness." />
      <SimulatorClient assessment={assessment} />
    </PageTransition>
  );
}
