import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "@/lib/auth";

export function ok<T>(data: T, message = "Success", init?: number) {
  return NextResponse.json({ success: true, data, message }, { status: init ?? 200 });
}

export function fail(code: string, message: string, status = 400) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof AuthError) {
    return fail(error.status === 403 ? "FORBIDDEN" : "UNAUTHORIZED", error.message, error.status);
  }
  if (error instanceof ZodError) {
    const first = error.issues[0];
    return fail("VALIDATION_ERROR", first ? `${first.path.join(".")}: ${first.message}` : "Invalid input", 422);
  }
  if (error instanceof Error) {
    console.error(error);
    return fail("INTERNAL_ERROR", "Something went wrong. Please try again.", 500);
  }
  console.error(error);
  return fail("INTERNAL_ERROR", "Something went wrong. Please try again.", 500);
}
