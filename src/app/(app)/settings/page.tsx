"use client";

import { PageTransition } from "@/components/animations/page-transition";
import { Card, SectionHeader } from "@/components/ui/card";
import { useMotionPreference } from "@/components/animations/motion-preference";

export default function SettingsPage() {
  const { reducedMotion, toggleReducedMotion } = useMotionPreference();

  return (
    <PageTransition>
      <SectionHeader title="Settings" description="Manage your accessibility and application preferences." />
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-text">Reduce Motion</p>
            <p className="mt-1 max-w-md text-sm text-text-secondary">
              Minimize animations across the application. We also automatically respect your operating system&apos;s
              reduced motion preference.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={reducedMotion}
            onClick={toggleReducedMotion}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${reducedMotion ? "bg-primary" : "bg-border"}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${reducedMotion ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      </Card>

      <Card className="mt-6">
        <SectionHeader title="Help & Support" />
        <p className="text-sm text-text-secondary">
          For questions about your readiness score or the platform, reach out to your placement cell or write to
          support@placementiq.app.
        </p>
      </Card>
    </PageTransition>
  );
}
