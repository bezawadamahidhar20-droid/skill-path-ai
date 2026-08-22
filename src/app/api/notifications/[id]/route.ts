import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";
import { and, eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const [updated] = await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, Number(id)), eq(notifications.userId, user.id)))
      .returning();
    return ok(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
