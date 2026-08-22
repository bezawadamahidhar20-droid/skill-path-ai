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
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger text-2xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold tracking-tight text-text">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          An unexpected error occurred. Please try again or return to sign in.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Try again
          </button>
          <a
            href="/login"
            className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-muted"
          >
            Return to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
