import { db } from "@/db";
import { projects } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";
import { and, eq } from "drizzle-orm";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await db.delete(projects).where(and(eq(projects.id, Number(id)), eq(projects.userId, user.id)));
    return ok(null, "Project removed");
  } catch (error) {
    return handleApiError(error);
  }
}
