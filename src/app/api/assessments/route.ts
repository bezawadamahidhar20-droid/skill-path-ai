import { db } from "@/db";
import { assessments, predictions, roadmapTasks, notifications, profiles } from "@/db/schema";
import { assessmentSchema } from "@/lib/validation";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";
import { computeReadiness, generateRoadmap, MODEL_VERSION, type AssessmentInput } from "@/lib/scoring";
import { getLatestAssessmentWithPrediction } from "@/lib/data";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await requireUser();
    let rows: any[] = [];
    try {
      rows = await db
        .select({ id: assessments.id, createdAt: assessments.createdAt })
        .from(assessments)
        .where(eq(assessments.userId, user.id));
    } catch (dbErr) {
      console.warn("DB error in GET /api/assessments:", dbErr);
    }
    return ok(rows);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = assessmentSchema.parse(body);

    const { prediction: previousPrediction } = await getLatestAssessmentWithPrediction(user.id);

    const input: AssessmentInput = {
      cgpa: data.cgpa,
      attendance: data.attendance,
      backlogs: data.backlogs,
      codingScore: data.codingScore,
      dsa: data.dsa,
      algorithms: data.algorithms,
      sqlScore: data.sqlScore,
      webDev: data.webDev,
      gitScore: data.gitScore,
      quant: data.quant,
      logical: data.logical,
      verbal: data.verbal,
      communication: data.communication,
      interviewConfidence: data.interviewConfidence,
      presentation: data.presentation,
      projectsCount: data.projectsCount,
      internshipsCount: data.internshipsCount,
      certificationsCount: data.certificationsCount,
      hackathonsCount: data.hackathonsCount,
      openSourceCount: data.openSourceCount,
      leadershipCount: data.leadershipCount,
      preferredRole: data.preferredRole,
    };

    const result = computeReadiness(input);
    let assessmentId = 1;
    let predictionObj: any = {
      id: 1,
      assessmentId,
      userId: user.id,
      modelVersion: MODEL_VERSION,
      score: result.score,
      level: result.level.label,
      breakdown: result.breakdown,
      positiveFactors: result.positiveFactors,
      improvementFactors: result.improvementFactors,
      featureContributions: result.contributions.map((c) => ({ label: c.label, value: c.contribution })),
      recommendations: result.recommendations,
    };

    try {
      const [assessment] = await db
        .insert(assessments)
        .values({
          userId: user.id,
          cgpa: String(data.cgpa),
          attendance: data.attendance,
          backlogs: data.backlogs,
          branch: data.branch,
          graduationYear: data.graduationYear,
          codingScore: data.codingScore,
          languages: data.languages,
          dsa: data.dsa,
          algorithms: data.algorithms,
          sqlScore: data.sqlScore,
          webDev: data.webDev,
          gitScore: data.gitScore,
          quant: data.quant,
          logical: data.logical,
          verbal: data.verbal,
          communication: data.communication,
          interviewConfidence: data.interviewConfidence,
          presentation: data.presentation,
          projectsCount: data.projectsCount,
          internshipsCount: data.internshipsCount,
          certificationsCount: data.certificationsCount,
          hackathonsCount: data.hackathonsCount,
          openSourceCount: data.openSourceCount,
          leadershipCount: data.leadershipCount,
          preferredRole: data.preferredRole,
          preferredIndustry: data.preferredIndustry,
          preferredLocation: data.preferredLocation,
          expectedSalaryRange: data.expectedSalaryRange,
          targetCompanies: data.targetCompanies,
        })
        .returning();

      if (assessment) {
        assessmentId = assessment.id;
        const [insertedPred] = await db
          .insert(predictions)
          .values({
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
          })
          .returning();
        if (insertedPred) predictionObj = insertedPred;
      }

      const roadmap = generateRoadmap(result);
      if (roadmap.length) {
        await db.delete(roadmapTasks).where(eq(roadmapTasks.userId, user.id));
        await db.insert(roadmapTasks).values(
          roadmap.map((task) => ({
            userId: user.id,
            week: task.week,
            title: task.title,
            category: task.category,
            description: task.description,
            orderIndex: task.orderIndex,
          })),
        );
      }

      await db
        .update(profiles)
        .set({ targetRole: data.preferredRole, branch: data.branch, graduationYear: data.graduationYear, updatedAt: new Date() })
        .where(eq(profiles.userId, user.id));

      const deltaMessage =
        previousPrediction && previousPrediction.score !== result.score
          ? ` (${result.score - previousPrediction.score >= 0 ? "+" : ""}${result.score - previousPrediction.score} points)`
          : "";

      await db.insert(notifications).values({
        userId: user.id,
        title: "New assessment completed",
        message: `Your placement readiness score is now ${result.score}/100${deltaMessage}.`,
        type: "success",
      });
    } catch (dbErr) {
      console.warn("DB error in POST /api/assessments:", dbErr);
    }

    return ok({ assessmentId, prediction: predictionObj }, "Assessment analyzed successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
