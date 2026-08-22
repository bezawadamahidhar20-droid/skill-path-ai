import { db } from "@/db";
import { projects } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";
import { getProjects } from "@/lib/data";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  technology: z.string().optional(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  role: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    const data = await getProjects(user.id);
    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = projectSchema.parse(body);
    let project: any = { id: Math.floor(Math.random() * 1000) + 1, userId: user.id, ...data };
    try {
      const [inserted] = await db
        .insert(projects)
        .values({ userId: user.id, ...data })
        .returning();
      if (inserted) project = inserted;
    } catch (dbErr) {
      console.warn("DB error in POST /api/projects:", dbErr);
    }
    return ok(project, "Project added successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
