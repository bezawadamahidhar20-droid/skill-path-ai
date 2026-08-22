"use client";

import type { ReactNode } from "react";
import { HoverCard } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";

export function MetricCard({
  label,
  value,
  decimals = 0,
  delta,
  deltaTone = "success",
  helper,
  icon,
}: {
  label: string;
  value: number;
  decimals?: number;
  delta?: string;
  deltaTone?: "success" | "warning" | "danger";
  helper?: string;
  icon?: ReactNode;
}) {
  const toneClass =
    deltaTone === "success" ? "text-success" : deltaTone === "warning" ? "text-warning" : "text-danger";
  return (
    <HoverCard>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        {icon ? <div className="text-primary">{icon}</div> : null}
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-text">
        <AnimatedNumber value={value} decimals={decimals} />
      </p>
      {delta ? <p className={`mt-1 text-xs font-medium ${toneClass}`}>{delta}</p> : null}
      {helper ? <p className="mt-1 text-xs text-text-secondary">{helper}</p> : null}
    </HoverCard>
  );
}
