import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";
import { getNotifications } from "@/lib/data";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await requireUser();
    const data = await getNotifications(user.id);
    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH() {
  try {
    const user = await requireUser();
    try {
      await db.update(notifications).set({ read: true }).where(eq(notifications.userId, user.id));
    } catch (dbErr) {
      console.warn("DB error in PATCH /api/notifications:", dbErr);
    }
    return ok(null, "All notifications marked as read");
  } catch (error) {
    return handleApiError(error);
  }
}
