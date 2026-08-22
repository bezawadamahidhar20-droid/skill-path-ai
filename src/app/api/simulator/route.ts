import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getLatestAssessment } from "@/lib/data";
import { ok, fail, handleApiError } from "@/lib/api-response";
import { simulate, type AssessmentInput } from "@/lib/scoring";
import { simulatorSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const assessment = await getLatestAssessment(user.id);
    if (!assessment) {
      return fail("NOT_FOUND", "Complete an assessment before using the simulator.", 404);
    }

    const body = await req.json();
    const overrides = simulatorSchema.parse(body);

    const base: AssessmentInput = {
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

    const target: AssessmentInput = { ...base, ...overrides };
    const result = simulate(base, target);

    return ok(result);
  } catch (error) {
    if (error instanceof z.ZodError) return handleApiError(error);
    return handleApiError(error);
  }
}
