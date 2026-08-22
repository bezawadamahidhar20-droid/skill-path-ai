"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center"
    >
      {icon ? <div className="mb-4 text-primary">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-text-secondary">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  );
}

export function ErrorState({ title = "Something went wrong", description, onRetry }: { title?: string; description: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-danger/20 bg-danger/5 px-6 py-14 text-center">
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
