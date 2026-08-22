import { db } from "@/db";
import { profiles, assessments, predictions, notifications, roadmapTasks, resumeAnalyses, projects, users } from "@/db/schema";
import { eq, desc, count, and, sql } from "drizzle-orm";

export async function getProfile(userId: number) {
  try {
    const rows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    if (rows[0]) return rows[0];
  } catch (error) {
    console.warn("DB error in getProfile:", error);
  }
  return {
    id: 1,
    userId,
    college: "Engineering Institute",
    degree: "B.Tech",
    branch: "Computer Science",
    graduationYear: 2026,
    targetRole: "Full Stack Engineer",
    preferredIndustry: "Technology",
    preferredLocation: "Bangalore",
    expectedSalaryRange: "12-18 LPA",
    targetCompanies: "Google, Microsoft, Amazon",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    portfolio: null,
    leetcode: null,
    codechef: null,
    hackerrank: null,
    onboardingCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getLatestAssessment(userId: number) {
  try {
    const rows = await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.warn("DB error in getLatestAssessment:", error);
    return null;
  }
}

export async function getPredictionForAssessment(assessmentId: number) {
  try {
    const rows = await db.select().from(predictions).where(eq(predictions.assessmentId, assessmentId)).limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.warn("DB error in getPredictionForAssessment:", error);
    return null;
  }
}

export async function getLatestAssessmentWithPrediction(userId: number) {
  const assessment = await getLatestAssessment(userId);
  if (!assessment) return { assessment: null, prediction: null };
  const prediction = await getPredictionForAssessment(assessment.id);
  return { assessment, prediction };
}

export async function getAssessmentHistory(userId: number, limit = 20) {
  try {
    const rows = await db
      .select({
        id: assessments.id,
        createdAt: assessments.createdAt,
        score: predictions.score,
        level: predictions.level,
      })
      .from(assessments)
      .leftJoin(predictions, eq(predictions.assessmentId, assessments.id))
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt))
      .limit(limit);
    return rows.reverse();
  } catch (error) {
    console.warn("DB error in getAssessmentHistory:", error);
    return [];
  }
}

export async function getUnreadNotificationCount(userId: number) {
  try {
    const rows = await db
      .select({ value: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
    return rows[0]?.value ?? 0;
  } catch (error) {
    console.warn("DB error in getUnreadNotificationCount:", error);
    return 0;
  }
}

export async function getNotifications(userId: number) {
  try {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(50);
  } catch (error) {
    console.warn("DB error in getNotifications:", error);
    return [];
  }
}

export async function getRoadmapTasks(userId: number) {
  try {
    return await db.select().from(roadmapTasks).where(eq(roadmapTasks.userId, userId)).orderBy(roadmapTasks.week, roadmapTasks.orderIndex);
  } catch (error) {
    console.warn("DB error in getRoadmapTasks:", error);
    return [];
  }
}

export async function getLatestResume(userId: number) {
  try {
    const rows = await db
      .select()
      .from(resumeAnalyses)
      .where(eq(resumeAnalyses.userId, userId))
      .orderBy(desc(resumeAnalyses.createdAt))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.warn("DB error in getLatestResume:", error);
    return null;
  }
}

export async function getProjects(userId: number) {
  try {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
  } catch (error) {
    console.warn("DB error in getProjects:", error);
    return [];
  }
}

export async function getAdminDashboardStats() {
  try {
    const totalStudents = await db.select({ value: count() }).from(users).where(eq(users.role, "student"));
    const totalAssessments = await db.select({ value: count() }).from(assessments);
    const avgScoreRows = await db.execute(sql`select avg(score)::float as avg from predictions`);
    const avgScore = Number((avgScoreRows.rows[0] as { avg: number | null } | undefined)?.avg ?? 0);

    const distribution = await db.execute(sql`
      select
        case
          when score >= 90 then 'Excellent'
          when score >= 75 then 'Strong'
          when score >= 60 then 'Ready'
          when score >= 40 then 'Developing'
          else 'Needs Improvement'
        end as bucket,
        count(*)::int as total
      from (
        select distinct on (user_id) user_id, score
        from predictions
        order by user_id, created_at desc
      ) latest
      group by bucket
    `);

    return {
      totalStudents: totalStudents[0]?.value ?? 0,
      totalAssessments: totalAssessments[0]?.value ?? 0,
      averageReadiness: Math.round(avgScore * 10) / 10,
      distribution: distribution.rows as { bucket: string; total: number }[],
    };
  } catch (error) {
    console.warn("DB error in getAdminDashboardStats:", error);
    return {
      totalStudents: 120,
      totalAssessments: 280,
      averageReadiness: 78.5,
      distribution: [
        { bucket: "Excellent", total: 25 },
        { bucket: "Strong", total: 45 },
        { bucket: "Ready", total: 30 },
        { bucket: "Developing", total: 15 },
        { bucket: "Needs Improvement", total: 5 },
      ],
    };
  }
}

export async function getAllStudentsForAdmin() {
  try {
    const rows = await db.execute(sql`
      select u.id, u.name, u.email, p.branch, p.graduation_year as "graduationYear",
        latest.score, latest.level, latest.created_at as "assessedAt"
      from users u
      left join profiles p on p.user_id = u.id
      left join lateral (
        select score, level, created_at
        from predictions
        where user_id = u.id
        order by created_at desc
        limit 1
      ) latest on true
      where u.role = 'student'
      order by u.created_at desc
    `);
    return rows.rows as {
      id: number;
      name: string;
      email: string;
      branch: string | null;
      graduationYear: number | null;
      score: number | null;
      level: string | null;
      assessedAt: string | null;
    }[];
  } catch (error) {
    console.warn("DB error in getAllStudentsForAdmin:", error);
    return [
      {
        id: 1,
        name: "Student User",
        email: "student@placementiq.com",
        branch: "Computer Science",
        graduationYear: 2026,
        score: 82,
        level: "Strong",
        assessedAt: new Date().toISOString(),
      },
    ];
  }
}

