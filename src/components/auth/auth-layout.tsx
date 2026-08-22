"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Check, Zap, Target, BarChart3, TrendingUp } from "lucide-react";

const FEATURES = [
  { icon: Zap, text: "AI-powered readiness analysis" },
  { icon: Target, text: "Personalized improvement roadmap" },
  { icon: BarChart3, text: "What-if placement simulator" },
  { icon: TrendingUp, text: "Real-time progress tracking" },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Panel - Decorative */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-indigo-900 px-12 py-14 text-white lg:flex">
        {/* Decorative shapes */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03]" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg font-bold backdrop-blur-sm">
              P
            </div>
            <span className="text-xl font-semibold tracking-tight">PlacementIQ</span>
          </div>
          <h1 className="mt-20 max-w-md text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Know where you stand.
            <br />
            Know what to improve.
            <br />
            <span className="text-white/80">Get placement ready.</span>
          </h1>
        </motion.div>

        <motion.ul
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
          }}
          className="relative z-10 flex flex-col gap-4"
        >
          {FEATURES.map(({ icon: Icon, text }) => (
            <motion.li
              key={text}
              variants={{
                initial: { opacity: 0, x: -12 },
                animate: { opacity: 1, x: 0 },
              }}
              className="flex items-center gap-3 text-sm text-white/90"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <Icon className="h-4 w-4" />
              </span>
              {text}
            </motion.li>
          ))}
        </motion.ul>

        {/* Footer */}
        <div className="relative z-10 mt-8 border-t border-white/10 pt-6">
          <p className="text-xs text-white/50">
            Trusted by 2,500+ students across 50+ colleges
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              P
            </div>
            <span className="text-lg font-semibold tracking-tight text-text">PlacementIQ</span>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
