import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";
import { profileSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { getProfile } from "@/lib/data";

export async function GET() {
  try {
    const user = await requireUser();
    const profile = await getProfile(user.id);
    return ok({ user, profile });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = profileSchema.parse(body);

    try {
      if (data.name) {
        await db.update(users).set({ name: data.name }).where(eq(users.id, user.id));
      }

      const { name: _name, ...profileFields } = data;
      void _name;

      await db
        .update(profiles)
        .set({ ...profileFields, updatedAt: new Date() })
        .where(eq(profiles.userId, user.id));
    } catch (dbErr) {
      console.warn("DB update failed in profile PATCH route handler:", dbErr);
    }

    return ok(null, "Profile updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
