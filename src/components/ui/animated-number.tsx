"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { useMotionPreference } from "@/components/animations/motion-preference";

export function AnimatedNumber({
  value,
  duration = 1,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const { reducedMotion } = useMotionPreference();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const first = useRef(true);

  useMotionValueEvent(motionValue, "change", (latest) => setDisplay(latest));

  useEffect(() => {
    if (reducedMotion || first.current === false) {
      first.current = false;
    }
    if (reducedMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reducedMotion]);

  return (
    <span className={className}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
