export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold">
          404
        </div>
        <h2 className="text-xl font-bold tracking-tight text-text">
          Page Not Found
        </h2>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/login"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Go to Sign In
        </a>
      </div>
    </div>
  );
}
