import { db } from "@/db";
import { roadmapTasks } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError, fail } from "@/lib/api-response";
import { eq, max } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { title, category, description, week } = body;

    if (!title) {
      return fail("VALIDATION_ERROR", "Task title is required", 400);
    }

    const maxOrders = await db
      .select({ maxIdx: max(roadmapTasks.orderIndex) })
      .from(roadmapTasks)
      .where(eq(roadmapTasks.userId, user.id));

    const nextOrder = (maxOrders[0]?.maxIdx ?? 0) + 1;

    const [newTask] = await db
      .insert(roadmapTasks)
      .values({
        userId: user.id,
        week: week || 1,
        title: title.trim(),
        category: category || "General Prep",
        description: description || "",
        status: "not_started",
        orderIndex: nextOrder,
      })
      .returning();

    return ok(newTask, "Roadmap task added successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { taskId, status } = body;

    if (!taskId || !status) {
      return fail("VALIDATION_ERROR", "Task ID and status are required", 400);
    }

    const [updatedTask] = await db
      .update(roadmapTasks)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(roadmapTasks.id, taskId))
      .returning();

    return ok(updatedTask, "Roadmap task status updated");
  } catch (error) {
    return handleApiError(error);
  }
}
