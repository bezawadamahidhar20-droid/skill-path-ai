import { db } from "@/db";
import { users } from "@/db/schema";
import { loginSchema } from "@/lib/validation";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { ok, fail, handleApiError } from "@/lib/api-response";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);
    const normalizedEmail = data.email.toLowerCase().trim();

    const rows = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    const user = rows[0];

    if (!user) {
      return fail("INVALID_CREDENTIALS", "Incorrect email or password.", 401);
    }

    const validPassword = await verifyPassword(data.password, user.passwordHash);
    if (!validPassword) {
      return fail("INVALID_CREDENTIALS", "Incorrect email or password.", 401);
    }

    await setSessionCookie({
      sub: user.id,
      email: user.email,
      role: user.role as "student" | "admin" | "placement_officer",
      name: user.name,
    });

    return ok({ id: user.id, name: user.name, email: user.email, role: user.role }, "Signed in successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
