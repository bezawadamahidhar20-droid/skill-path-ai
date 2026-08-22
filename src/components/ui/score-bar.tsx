"use client";

import { motion } from "motion/react";

export function ScoreBar({
  label,
  value,
  onClick,
  color = "#7D4047",
}: {
  label: string;
  value: number;
  onClick?: () => void;
  color?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={`w-full text-left ${onClick ? "cursor-pointer transition-opacity hover:opacity-80" : ""}`}
    >
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-text">{label}</span>
        <span className="font-semibold tabular-nums text-text-secondary">{Math.round(clamped)}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/60">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${clamped}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </Wrapper>
  );
}
