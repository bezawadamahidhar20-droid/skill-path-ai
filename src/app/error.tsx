"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
          ⚠️
        </div>
        <h2 className="text-xl font-semibold text-text">Something went wrong</h2>
        <p className="mt-2 text-sm text-text-secondary">
          An unhandled error occurred. Please try again or return to sign in.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/login"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-text transition hover:bg-muted"
          >
            Return to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
