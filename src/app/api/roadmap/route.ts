import { db } from "@/db";
import { roadmapTasks } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getLatestAssessmentWithPrediction, getRoadmapTasks } from "@/lib/data";
import { ok, fail, handleApiError } from "@/lib/api-response";
import { computeReadiness, generateRoadmap, type AssessmentInput } from "@/lib/scoring";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await requireUser();
    const tasks = await getRoadmapTasks(user.id);
    return ok(tasks);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  try {
    const user = await requireUser();
    const { assessment } = await getLatestAssessmentWithPrediction(user.id);
    if (!assessment) {
      return fail("NOT_FOUND", "Complete an assessment before generating a roadmap.", 404);
    }

    const input: AssessmentInput = {
      cgpa: Number(assessment.cgpa),
      attendance: assessment.attendance,
      backlogs: assessment.backlogs,
      codingScore: assessment.codingScore,
      dsa: assessment.dsa,
      algorithms: assessment.algorithms,
      sqlScore: assessment.sqlScore,
      webDev: assessment.webDev,
      gitScore: assessment.gitScore,
      quant: assessment.quant,
      logical: assessment.logical,
      verbal: assessment.verbal,
      communication: assessment.communication,
      interviewConfidence: assessment.interviewConfidence,
      presentation: assessment.presentation,
      projectsCount: assessment.projectsCount,
      internshipsCount: assessment.internshipsCount,
      certificationsCount: assessment.certificationsCount,
      hackathonsCount: assessment.hackathonsCount,
      openSourceCount: assessment.openSourceCount,
      leadershipCount: assessment.leadershipCount,
      preferredRole: assessment.preferredRole,
    };

    const result = computeReadiness(input);
    const roadmap = generateRoadmap(result);

    let inserted: any[] = [];
    try {
      await db.delete(roadmapTasks).where(eq(roadmapTasks.userId, user.id));
      inserted = roadmap.length
        ? await db
            .insert(roadmapTasks)
            .values(
              roadmap.map((task) => ({
                userId: user.id,
                week: task.week,
                title: task.title,
                category: task.category,
                description: task.description,
                orderIndex: task.orderIndex,
              })),
            )
            .returning()
        : [];
    } catch (dbErr) {
      console.warn("DB error in POST /api/roadmap:", dbErr);
      inserted = roadmap.map((task, idx) => ({ id: idx + 1, userId: user.id, status: "not_started", ...task }));
    }

    return ok(inserted, "Roadmap regenerated");
  } catch (error) {
    return handleApiError(error);
  }
}
