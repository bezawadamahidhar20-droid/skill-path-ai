import { redirect } from "next/navigation";
import { requirePageUser } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await requirePageUser();
  const profile = await getProfile(user.id);

  if (profile?.onboardingCompleted) {
    redirect("/dashboard");
  }

  return <OnboardingWizard />;
}
