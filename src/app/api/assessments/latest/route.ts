import { requireUser } from "@/lib/auth";
import { getLatestAssessmentWithPrediction } from "@/lib/data";
import { ok, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await requireUser();
    const data = await getLatestAssessmentWithPrediction(user.id);
    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}
