import { requireRole } from "@/lib/auth";
import { getAdminDashboardStats, getAllStudentsForAdmin } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger";
import { SectionHeader } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { StudentsTable } from "@/components/admin/students-table";
import { DistributionChart } from "@/components/charts/distribution-chart";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireRole(["admin", "placement_officer"]);
  const [stats, students] = await Promise.all([getAdminDashboardStats(), getAllStudentsForAdmin()]);

  const readyCount = students.filter((s) => (s.score ?? 0) >= 60).length;
  const needsImprovementCount = students.filter((s) => (s.score ?? -1) >= 0 && (s.score ?? 0) < 40).length;
  const readyPct = students.length ? Math.round((readyCount / students.length) * 100) : 0;
  const needsPct = students.length ? Math.round((needsImprovementCount / students.length) * 100) : 0;

  return (
    <PageTransition>
      <SectionHeader title="Admin Dashboard" description="Platform-wide placement readiness analytics." />
      <StaggerContainer className="flex flex-col gap-6">
        <StaggerItem>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard label="Total Students" value={Number(stats.totalStudents)} />
            <MetricCard label="Assessments" value={Number(stats.totalAssessments)} />
            <MetricCard label="Average Readiness" value={stats.averageReadiness} decimals={1} />
            <MetricCard label="Placement Ready" value={readyPct} helper={`${readyPct}% score 60+`} />
          </div>
        </StaggerItem>

        <StaggerItem>
          <Card>
            <SectionHeader title="Placement Readiness Distribution" description={`${needsPct}% of students need improvement`} />
            <DistributionChart data={stats.distribution} />
          </Card>
        </StaggerItem>

        <StaggerItem>
          <StudentsTable students={students} />
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
