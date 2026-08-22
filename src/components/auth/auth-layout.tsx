"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Check } from "lucide-react";

const FEATURES = [
  "AI-powered readiness analysis",
  "Personalized improvement roadmap",
  "What-if placement simulator",
  "Progress tracking",
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary px-12 py-14 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-lg font-bold">P</div>
            <span className="text-xl font-semibold tracking-tight">PlacementIQ</span>
          </div>
          <h1 className="mt-16 max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Know where you stand.
            <br />
            Know what to improve.
            <br />
            Get placement ready.
          </h1>
        </motion.div>
        <motion.ul
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
          className="relative z-10 flex flex-col gap-3"
        >
          {FEATURES.map((f) => (
            <motion.li
              key={f}
              variants={{ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 } }}
              className="flex items-center gap-2.5 text-sm text-white/90"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                <Check className="h-3 w-3" />
              </span>
              {f}
            </motion.li>
          ))}
        </motion.ul>
      </div>
      <div className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
