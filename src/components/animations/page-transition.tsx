"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { pageVariants } from "@/lib/motion-variants";

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} className={className}>
      {children}
    </motion.div>
  );
}
