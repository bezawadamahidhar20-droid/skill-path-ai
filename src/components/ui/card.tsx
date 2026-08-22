"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function HoverCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-text sm:text-2xl">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-text-secondary leading-relaxed">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
