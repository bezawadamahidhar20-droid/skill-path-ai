import { db } from "@/db";
import { profiles, assessments, predictions, roadmapTasks, notifications } from "@/db/schema";
import { onboardingSchema } from "@/lib/validation";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";
import { computeReadiness, generateRoadmap, MODEL_VERSION, type AssessmentInput } from "@/lib/scoring";
import { eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = onboardingSchema.parse(body);

    // 1. Idempotency Check: Check if user already completed onboarding
    const existingProfiles = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
    const existingProfile = existingProfiles[0];

    if (existingProfile?.onboardingCompleted) {
      // User has already completed onboarding. Fetch their latest prediction score if available.
      const latestPredictions = await db
        .select()
        .from(predictions)
        .where(eq(predictions.userId, user.id))
        .orderBy(desc(predictions.createdAt))
        .limit(1);

      const score = latestPredictions[0]?.score ?? 0;
      return ok({ score, alreadyCompleted: true }, "Onboarding already completed");
    }

    // 2. Decoupled AI / Readiness scoring computation (outside DB transaction)
    const input: AssessmentInput = {
      cgpa: data.cgpa,
      attendance: data.attendance,
      backlogs: data.backlogs,
      codingScore: data.codingScore,
      dsa: Math.max(0, data.codingScore - 8),
      algorithms: Math.max(0, data.codingScore - 12),
      sqlScore: Math.max(0, data.codingScore - 6),
      webDev: Math.max(0, data.codingScore - 4),
      gitScore: Math.max(0, data.codingScore - 2),
      quant: data.quant,
      logical: Math.max(0, data.quant - 4),
      verbal: Math.max(0, data.quant - 6),
      communication: data.communication,
      interviewConfidence: Math.max(0, data.communication - 5),
      presentation: Math.max(0, data.communication - 3),
      projectsCount: data.projectsCount,
      internshipsCount: data.internshipsCount,
      certificationsCount: data.certificationsCount,
      hackathonsCount: data.hackathonsCount,
      openSourceCount: data.openSourceCount,
      leadershipCount: 0,
      preferredRole: data.targetRole,
    };

    const result = computeReadiness(input);
    const roadmap = generateRoadmap(result);

    // 3. Fast, atomic database transaction for writing onboarding records
    await db.transaction(async (tx) => {
      // Update profile status
      await tx
        .update(profiles)
        .set({
          college: data.college,
          degree: data.degree,
          branch: data.branch,
          graduationYear: data.graduationYear,
          targetRole: data.targetRole,
          onboardingCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, user.id));

      // Insert initial assessment
      const [assessment] = await tx
        .insert(assessments)
        .values({
          userId: user.id,
          cgpa: String(data.cgpa),
          attendance: data.attendance,
          backlogs: data.backlogs,
          branch: data.branch,
          graduationYear: data.graduationYear,
          codingScore: data.codingScore,
          languages: [],
          dsa: input.dsa,
          algorithms: input.algorithms,
          sqlScore: input.sqlScore,
          webDev: input.webDev,
          gitScore: input.gitScore,
          quant: data.quant,
          logical: input.logical,
          verbal: input.verbal,
          communication: data.communication,
          interviewConfidence: input.interviewConfidence,
          presentation: input.presentation,
          projectsCount: data.projectsCount,
          internshipsCount: data.internshipsCount,
          certificationsCount: data.certificationsCount,
          hackathonsCount: data.hackathonsCount,
          openSourceCount: data.openSourceCount,
          leadershipCount: 0,
          preferredRole: data.targetRole,
        })
        .returning();

      if (assessment) {
        await tx.insert(predictions).values({
          assessmentId: assessment.id,
          userId: user.id,
          modelVersion: MODEL_VERSION,
          score: result.score,
          level: result.level.label,
          breakdown: result.breakdown,
          positiveFactors: result.positiveFactors,
          improvementFactors: result.improvementFactors,
          featureContributions: result.contributions.map((c) => ({ label: c.label, value: c.contribution })),
          recommendations: result.recommendations,
        });
      }

      if (roadmap.length) {
        await tx.insert(roadmapTasks).values(
          roadmap.map((task) => ({
            userId: user.id,
            week: task.week,
            title: task.title,
            category: task.category,
            description: task.description,
            orderIndex: task.orderIndex,
          }))
        );
      }

      await tx.insert(notifications).values({
        userId: user.id,
        title: "Your first readiness score is ready",
        message: `Your placement readiness score is ${result.score}/100 — ${result.level.label}.`,
        type: "success",
      });
    });

    return ok({ score: result.score }, "Onboarding completed successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
