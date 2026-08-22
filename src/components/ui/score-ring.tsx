"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { useMotionPreference } from "@/components/animations/motion-preference";

export function ScoreRing({
  score,
  size = 176,
  strokeWidth = 14,
  label,
  color = "#7D4047",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}) {
  const { reducedMotion } = useMotionPreference();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E6DED7" strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: reducedMotion ? offset : offset }}
          transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular-nums text-text">
          <AnimatedNumber value={clamped} />
        </span>
        <span className="text-xs font-medium text-text-secondary">/100</span>
        {label ? <span className="mt-1 text-[11px] font-medium text-text-secondary">{label}</span> : null}
      </div>
    </div>
  );
}
