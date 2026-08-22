import { requirePageUser } from "@/lib/auth";
import { getLatestResume } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { SectionHeader } from "@/components/ui/card";
import { ResumeClient } from "@/components/resume/resume-client";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const user = await requirePageUser();
  const latest = await getLatestResume(user.id);

  return (
    <PageTransition>
      <SectionHeader title="Resume Intelligence" description="Get an ATS-style score, skill gap detection and improvement suggestions." />
      <ResumeClient latest={latest} />
    </PageTransition>
  );
}
