import { requirePageUser } from "@/lib/auth";
import { getProfile, getProjects } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { SectionHeader } from "@/components/ui/card";
import { ProfileClient } from "@/components/profile/profile-client";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requirePageUser();
  const [profile, projects] = await Promise.all([getProfile(user.id), getProjects(user.id)]);

  return (
    <PageTransition>
      <SectionHeader title="Profile" description="Keep your information up to date for the most accurate readiness score." />
      {profile ? <ProfileClient user={user} profile={profile} projects={projects} /> : null}
    </PageTransition>
  );
}
