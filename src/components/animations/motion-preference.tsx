"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

interface MotionPreferenceContextValue {
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const MotionPreferenceContext = createContext<MotionPreferenceContextValue>({
  reducedMotion: false,
  toggleReducedMotion: () => {},
});

export function useMotionPreference() {
  return useContext(MotionPreferenceContext);
}

function subscribeToSystemPreference(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSystemPreferenceSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getStoredPreference() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("piq_reduced_motion") === "true";
}

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const systemPrefersReduced = useSyncExternalStore(subscribeToSystemPreference, getSystemPreferenceSnapshot, () => false);
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

  const reducedMotion = manualOverride ?? getStoredPreference() ?? systemPrefersReduced;

  const value = useMemo<MotionPreferenceContextValue>(
    () => ({
      reducedMotion: reducedMotion || systemPrefersReduced,
      toggleReducedMotion: () => {
        setManualOverride((prev) => {
          const next = !(prev ?? getStoredPreference());
          if (typeof window !== "undefined") {
            window.localStorage.setItem("piq_reduced_motion", String(next));
          }
          return next;
        });
      },
    }),
    [reducedMotion, systemPrefersReduced],
  );

  return (
    <MotionPreferenceContext.Provider value={value}>
      <MotionConfig reducedMotion={value.reducedMotion ? "always" : "user"}>{children}</MotionConfig>
    </MotionPreferenceContext.Provider>
  );
}
