"use client";

import { type ReactNode } from "react";
import { MotionPreferenceProvider } from "@/components/animations/motion-preference";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionPreferenceProvider>
      <ToastProvider>{children}</ToastProvider>
    </MotionPreferenceProvider>
  );
}
