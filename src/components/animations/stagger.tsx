"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { staggerContainer, cardVariants } from "@/lib/motion-variants";

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={cardVariants} className={className}>
      {children}
    </motion.div>
  );
}
