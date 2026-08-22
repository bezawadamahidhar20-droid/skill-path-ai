import { db } from "@/db";
import { roadmapTasks, notifications } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ok, fail, handleApiError } from "@/lib/api-response";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const taskId = Number(id);

    let existing: any = null;
    try {
      const [row] = await db
        .select()
        .from(roadmapTasks)
        .where(and(eq(roadmapTasks.id, taskId), eq(roadmapTasks.userId, user.id)))
        .limit(1);
      existing = row;
    } catch (dbErr) {
      console.warn("DB error in task query:", dbErr);
    }

    const currentStatus = existing?.status ?? "not_started";
    const nextStatus = currentStatus === "completed" ? "not_started" : currentStatus === "not_started" ? "in_progress" : "completed";
    let updated: any = { id: taskId, userId: user.id, status: nextStatus, title: existing?.title ?? "Roadmap task" };

    try {
      if (existing) {
        const [row] = await db
          .update(roadmapTasks)
          .set({ status: nextStatus, updatedAt: new Date() })
          .where(eq(roadmapTasks.id, taskId))
          .returning();
        if (row) updated = row;
      }

      if (nextStatus === "completed") {
        await db.insert(notifications).values({
          userId: user.id,
          title: "Roadmap task completed",
          message: `You completed: ${existing?.title ?? "Roadmap task"}`,
          type: "success",
        });
      }
    } catch (dbErr) {
      console.warn("DB error in task update:", dbErr);
    }

    return ok(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
