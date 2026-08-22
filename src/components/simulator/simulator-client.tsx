"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Card, SectionHeader } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Badge } from "@/components/ui/badge";
import { simulate, SIMULATOR_FIELDS, type AssessmentInput } from "@/lib/scoring";
import { toneForScore } from "@/lib/utils";
import type { assessments } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Assessment = InferSelectModel<typeof assessments>;

function toBaseInput(a: Assessment): AssessmentInput {
  return {
    cgpa: Number(a.cgpa),
    attendance: a.attendance,
    backlogs: a.backlogs,
    codingScore: a.codingScore,
    dsa: a.dsa,
    algorithms: a.algorithms,
    sqlScore: a.sqlScore,
    webDev: a.webDev,
    gitScore: a.gitScore,
    quant: a.quant,
    logical: a.logical,
    verbal: a.verbal,
    communication: a.communication,
    interviewConfidence: a.interviewConfidence,
    presentation: a.presentation,
    projectsCount: a.projectsCount,
    internshipsCount: a.internshipsCount,
    certificationsCount: a.certificationsCount,
    hackathonsCount: a.hackathonsCount,
    openSourceCount: a.openSourceCount,
    leadershipCount: a.leadershipCount,
    preferredRole: a.preferredRole,
  };
}

export function SimulatorClient({ assessment }: { assessment: Assessment }) {
  const base = useMemo(() => toBaseInput(assessment), [assessment]);
  const [target, setTarget] = useState<AssessmentInput>(base);

  const result = useMemo(() => simulate(base, target), [base, target]);

  function updateField(key: keyof AssessmentInput, value: number) {
    setTarget((prev) => ({ ...prev, [key]: value }));
  }

  const tone = toneForScore(result.projected);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <SectionHeader title="Adjust Your Profile" description="Drag the sliders to explore improvements." />
        <div className="flex flex-col gap-6">
          {SIMULATOR_FIELDS.map((f) => {
            const currentVal = base[f.key] as number;
            const targetVal = target[f.key] as number;
            return (
              <div key={f.key}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-text">{f.label}</span>
                  <span className="tabular-nums text-text-secondary">
                    {f.key === "cgpa" ? currentVal.toFixed(1) : currentVal} →{" "}
                    <span className="font-semibold text-primary">{f.key === "cgpa" ? targetVal.toFixed(1) : targetVal}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={targetVal}
                  onChange={(e) => updateField(f.key, Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-[#7D4047]"
                  aria-label={f.label}
                />
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Projected Readiness</p>
          <div className="mt-3 flex items-center justify-center gap-8">
            <div>
              <p className="text-xs text-text-secondary">Current</p>
              <p className="text-3xl font-semibold tabular-nums text-text-secondary">{result.current}</p>
            </div>
            <motion.div key={result.projected} className="text-4xl font-bold tabular-nums text-primary">
              <AnimatedNumber value={result.projected} duration={0.5} />
            </motion.div>
            <div>
              <p className="text-xs text-text-secondary">Change</p>
              <p className={`text-3xl font-semibold tabular-nums ${result.delta >= 0 ? "text-success" : "text-danger"}`}>
                {result.delta >= 0 ? "+" : ""}
                {result.delta}
              </p>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <Badge tone={tone}>{result.projectedLevel.label}</Badge>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Comparison" />
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="pb-2 font-medium">Metric</th>
                <th className="pb-2 font-medium">Current</th>
                <th className="pb-2 font-medium">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SIMULATOR_FIELDS.map((f) => (
                <tr key={f.key}>
                  <td className="py-2 text-text">{f.label}</td>
                  <td className="py-2 tabular-nums text-text-secondary">
                    {f.key === "cgpa" ? (base[f.key] as number).toFixed(1) : base[f.key]}
                  </td>
                  <td className="py-2 tabular-nums font-medium text-primary">
                    {f.key === "cgpa" ? (target[f.key] as number).toFixed(1) : target[f.key]}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-2 text-text">Readiness</td>
                <td className="py-2 tabular-nums text-text-secondary">{result.current}</td>
                <td className="py-2 tabular-nums text-primary">{result.projected}</td>
              </tr>
            </tbody>
          </table>
        </Card>

        {result.highestImpact && result.highestImpact.delta > 0 ? (
          <Card className="bg-primary-soft/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Highest-impact improvement</p>
            <p className="mt-1 text-lg font-semibold text-text">{result.highestImpact.label}</p>
            <p className="text-sm text-text-secondary">Estimated impact: +{result.highestImpact.delta} points</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
