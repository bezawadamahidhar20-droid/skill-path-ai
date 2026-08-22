import { requireRole } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/data";
import { ok, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    await requireRole(["admin", "placement_officer"]);
    const stats = await getAdminDashboardStats();
    return ok(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
