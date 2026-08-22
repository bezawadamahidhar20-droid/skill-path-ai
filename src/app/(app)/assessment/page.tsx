import { requirePageUser } from "@/lib/auth";
import { getLatestAssessment, getProfile } from "@/lib/data";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const user = await requirePageUser();
  const [assessment, profile] = await Promise.all([getLatestAssessment(user.id), getProfile(user.id)]);

  return <AssessmentWizard existing={assessment} profile={profile} />;
}
