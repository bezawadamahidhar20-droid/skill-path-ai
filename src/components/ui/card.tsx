"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(37,37,37,0.04)]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function HoverCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(37,37,37,0.08)" }}
      transition={{ duration: 0.2 }}
      className={cn("rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(37,37,37,0.04)]", className)}
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
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">{title}</h2>
        {description ? <p className="mt-1 text-sm text-text-secondary">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
