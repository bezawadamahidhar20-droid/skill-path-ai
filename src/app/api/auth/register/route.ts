import { db } from "@/db";
import { users, profiles, notifications } from "@/db/schema";
import { registerSchema } from "@/lib/validation";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { ok, fail, handleApiError } from "@/lib/api-response";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check existing email before starting transaction
    const existing = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    if (existing.length > 0) {
      return fail("DUPLICATE_EMAIL", "An account with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(data.password);

    // Perform user creation, profile initialization, and welcome notification transactionally
    const user = await db.transaction(async (tx) => {
      const [insertedUser] = await tx
        .insert(users)
        .values({
          name: data.name.trim(),
          email: normalizedEmail,
          passwordHash,
          role: "student",
        })
        .returning();

      if (!insertedUser) {
        throw new Error("Failed to create user record");
      }

      await tx.insert(profiles).values({
        userId: insertedUser.id,
        onboardingCompleted: false,
      });

      await tx.insert(notifications).values({
        userId: insertedUser.id,
        title: "Welcome to PlacementIQ",
        message: "Complete your onboarding to get your first placement readiness score.",
        type: "info",
      });

      return insertedUser;
    });

    // Create session cookie after successful database transaction
    await setSessionCookie({
      sub: user.id,
      email: user.email,
      role: user.role as "student",
      name: user.name,
    });

    return ok(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      "Account created successfully",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
