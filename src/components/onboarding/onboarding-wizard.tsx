"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, SliderField } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { BRANCHES, DEGREES } from "@/lib/constants";
import { CAREER_ROLES } from "@/lib/scoring";

const STEPS = ["About You", "Academic Profile", "Technical Profile", "Experience", "Career Goal"];

interface FormState {
  college: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  attendance: number;
  backlogs: number;
  codingScore: number;
  quant: number;
  communication: number;
  projectsCount: number;
  internshipsCount: number;
  certificationsCount: number;
  hackathonsCount: number;
  openSourceCount: number;
  targetRole: string;
}

const initialState: FormState = {
  college: "",
  degree: "B.Tech",
  branch: BRANCHES[0],
  graduationYear: new Date().getFullYear() + 1,
  cgpa: 7.5,
  attendance: 85,
  backlogs: 0,
  codingScore: 60,
  quant: 60,
  communication: 60,
  projectsCount: 2,
  internshipsCount: 0,
  certificationsCount: 1,
  hackathonsCount: 0,
  openSourceCount: 0,
  targetRole: CAREER_ROLES[0],
};

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const isLast = step === STEPS.length - 1;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      let json: any;
      try {
        json = await res.json();
      } catch {
        setError("Received invalid response from server. Please try again.");
        setSubmitting(false);
        return;
      }

      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Failed to complete onboarding. Please try again.");
        setSubmitting(false);
        return;
      }

      setDone(true);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-text">You&apos;re ready.</h1>
          <p className="mt-2 text-text-secondary">Calculating your Placement Readiness…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
            P
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Tell us about yourself</h1>
          <p className="mt-1 text-sm text-text-secondary">A few quick questions to calculate your first readiness score.</p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-text-secondary">
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
            <span>{STEPS[step]}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              {step === 0 ? (
                <>
                  <Field label="College" htmlFor="college" required>
                    <Input id="college" value={form.college} onChange={(e) => update("college", e.target.value)} placeholder="Your college name" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Degree" htmlFor="degree">
                      <Select id="degree" value={form.degree} onChange={(e) => update("degree", e.target.value)}>
                        {DEGREES.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Graduation Year" htmlFor="gradYear">
                      <Input
                        id="gradYear"
                        type="number"
                        value={form.graduationYear}
                        onChange={(e) => update("graduationYear", Number(e.target.value))}
                      />
                    </Field>
                  </div>
                  <Field label="Branch" htmlFor="branch">
                    <Select id="branch" value={form.branch} onChange={(e) => update("branch", e.target.value)}>
                      {BRANCHES.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </Select>
                  </Field>
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <Field label="CGPA" htmlFor="cgpa" hint="Enter a value between 0 and 10.">
                    <Input
                      id="cgpa"
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={form.cgpa}
                      onChange={(e) => update("cgpa", Number(e.target.value))}
                    />
                  </Field>
                  <SliderField label="Attendance" value={form.attendance} suffix="%" onChange={(v) => update("attendance", v)} />
                  <Field label="Active Backlogs" htmlFor="backlogs" hint="Enter 0 if none.">
                    <Input
                      id="backlogs"
                      type="number"
                      min={0}
                      value={form.backlogs}
                      onChange={(e) => update("backlogs", Number(e.target.value))}
                    />
                  </Field>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <SliderField label="Overall Coding Score" value={form.codingScore} onChange={(v) => update("codingScore", v)} />
                  <SliderField label="Aptitude (Quant + Logical)" value={form.quant} onChange={(v) => update("quant", v)} />
                  <SliderField label="Communication" value={form.communication} onChange={(v) => update("communication", v)} />
                </>
              ) : null}

              {step === 3 ? (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Projects" htmlFor="projects">
                    <Input id="projects" type="number" min={0} value={form.projectsCount} onChange={(e) => update("projectsCount", Number(e.target.value))} />
                  </Field>
                  <Field label="Internships" htmlFor="internships">
                    <Input id="internships" type="number" min={0} value={form.internshipsCount} onChange={(e) => update("internshipsCount", Number(e.target.value))} />
                  </Field>
                  <Field label="Certifications" htmlFor="certs">
                    <Input id="certs" type="number" min={0} value={form.certificationsCount} onChange={(e) => update("certificationsCount", Number(e.target.value))} />
                  </Field>
                  <Field label="Hackathons" htmlFor="hackathons">
                    <Input id="hackathons" type="number" min={0} value={form.hackathonsCount} onChange={(e) => update("hackathonsCount", Number(e.target.value))} />
                  </Field>
                  <Field label="Open Source Contributions" htmlFor="oss">
                    <Input id="oss" type="number" min={0} value={form.openSourceCount} onChange={(e) => update("openSourceCount", Number(e.target.value))} />
                  </Field>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="grid grid-cols-2 gap-3">
                  {CAREER_ROLES.map((role) => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => update("targetRole", role)}
                      className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        form.targetRole === role ? "border-primary bg-primary-soft text-primary" : "border-border text-text hover:bg-background"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {error ? <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm font-medium text-danger">{error}</p> : null}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              ← Previous
            </Button>
            {isLast ? (
              <Button onClick={handleSubmit} loading={submitting}>
                Analyze My Placement Readiness
              </Button>
            ) : (
              <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>Next →</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
