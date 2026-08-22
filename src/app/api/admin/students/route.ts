import { requireRole } from "@/lib/auth";
import { getAllStudentsForAdmin } from "@/lib/data";
import { ok, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    await requireRole(["admin", "placement_officer"]);
    const students = await getAllStudentsForAdmin();
    return ok(students);
  } catch (error) {
    return handleApiError(error);
  }
}
