"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, SliderField, Checkbox, ConfidenceField } from "@/components/ui/form";
import { Card, SectionHeader } from "@/components/ui/card";
import { BRANCHES, PROGRAMMING_LANGUAGES, INDUSTRIES } from "@/lib/constants";
import { CAREER_ROLES } from "@/lib/scoring";
import type { assessments } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Assessment = InferSelectModel<typeof assessments>;
interface Profile {
  branch?: string | null;
  graduationYear?: number | null;
  targetRole?: string | null;
}

const STEPS = ["Academic", "Technical Skills", "Aptitude & Communication", "Experience", "Career Preferences"];

interface FormState {
  cgpa: number;
  attendance: number;
  backlogs: number;
  branch: string;
  graduationYear: number;
  codingScore: number;
  languages: string[];
  dsa: number;
  algorithms: number;
  sqlScore: number;
  webDev: number;
  gitScore: number;
  quant: number;
  logical: number;
  verbal: number;
  communication: number;
  interviewConfidence: number;
  presentation: number;
  projectsCount: number;
  internshipsCount: number;
  certificationsCount: number;
  hackathonsCount: number;
  openSourceCount: number;
  leadershipCount: number;
  preferredRole: string;
  preferredIndustry: string;
  preferredLocation: string;
  expectedSalaryRange: string;
  targetCompanies: string;
}

function buildDefaults(existing: Assessment | null, profile: Profile | null): FormState {
  return {
    cgpa: existing ? Number(existing.cgpa) : 7.5,
    attendance: existing?.attendance ?? 85,
    backlogs: existing?.backlogs ?? 0,
    branch: existing?.branch ?? profile?.branch ?? BRANCHES[0],
    graduationYear: existing?.graduationYear ?? profile?.graduationYear ?? new Date().getFullYear() + 1,
    codingScore: existing?.codingScore ?? 60,
    languages: existing?.languages ?? ["Python"],
    dsa: existing?.dsa ?? 55,
    algorithms: existing?.algorithms ?? 55,
    sqlScore: existing?.sqlScore ?? 55,
    webDev: existing?.webDev ?? 55,
    gitScore: existing?.gitScore ?? 60,
    quant: existing?.quant ?? 60,
    logical: existing?.logical ?? 60,
    verbal: existing?.verbal ?? 60,
    communication: existing?.communication ?? 60,
    interviewConfidence: existing?.interviewConfidence ?? 55,
    presentation: existing?.presentation ?? 55,
    projectsCount: existing?.projectsCount ?? 2,
    internshipsCount: existing?.internshipsCount ?? 0,
    certificationsCount: existing?.certificationsCount ?? 1,
    hackathonsCount: existing?.hackathonsCount ?? 0,
    openSourceCount: existing?.openSourceCount ?? 0,
    leadershipCount: existing?.leadershipCount ?? 0,
    preferredRole: existing?.preferredRole ?? profile?.targetRole ?? CAREER_ROLES[0],
    preferredIndustry: existing?.preferredIndustry ?? INDUSTRIES[0],
    preferredLocation: existing?.preferredLocation ?? "",
    expectedSalaryRange: existing?.expectedSalaryRange ?? "",
    targetCompanies: existing?.targetCompanies ?? "",
  };
}

const ANALYSIS_STEPS = [
  "Analyzing academic profile",
  "Evaluating technical skills",
  "Assessing experience & projects",
  "Reviewing career preferences",
  "Generating readiness prediction",
];

export function AssessmentWizard({ existing, profile }: { existing: Assessment | null; profile: Profile | null }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() => buildDefaults(existing, profile));
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isLast = step === STEPS.length - 1;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleLanguage(lang: string) {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang) ? prev.languages.filter((l) => l !== lang) : [...prev.languages, lang],
    }));
  }

  async function handleSubmit() {
    setError(null);
    setAnalyzing(true);
    setAnalysisStep(0);

    const interval = setInterval(() => {
      setAnalysisStep((s) => Math.min(ANALYSIS_STEPS.length - 1, s + 1));
    }, 500);

    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      clearInterval(interval);
      if (!json.success) {
        setError(json.error?.message ?? "We couldn't analyze your profile.");
        setAnalyzing(false);
        return;
      }
      setAnalysisStep(ANALYSIS_STEPS.length - 1);
      setTimeout(() => {
        router.push("/results");
        router.refresh();
      }, 800);
    } catch {
      clearInterval(interval);
      setError("We couldn't reach the server. Please try again.");
      setAnalyzing(false);
    }
  }

  if (analyzing) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <div className="relative mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-text">Analyzing your profile…</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Generating your personalized placement readiness report
        </p>
        <ul className="mt-8 w-full max-w-sm space-y-2 text-left">
          {ANALYSIS_STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all">
              {i <= analysisStep ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              ) : (
                <span className="h-6 w-6 shrink-0 rounded-full border-2 border-border" />
              )}
              <span className={i <= analysisStep ? "font-semibold text-text" : "text-text-secondary"}>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Placement Readiness Assessment"
        description="Evaluate your current academic, technical, communication and professional readiness. Estimated time: 3-5 minutes."
      />

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-xs font-bold text-primary">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-xs font-semibold text-text-secondary">{STEPS[step]}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
            {step === 0 ? (
              <>
                <Field label="CGPA" htmlFor="cgpa" hint="Enter a value between 0 and 10.">
                  <Input id="cgpa" type="number" min={0} max={10} step={0.1} value={form.cgpa} onChange={(e) => update("cgpa", Number(e.target.value))} />
                </Field>
                <SliderField label="Attendance" value={form.attendance} suffix="%" onChange={(v) => update("attendance", v)} />
                <Field label="Active Backlogs" htmlFor="backlogs">
                  <Input id="backlogs" type="number" min={0} value={form.backlogs} onChange={(e) => update("backlogs", Number(e.target.value))} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Engineering Branch" htmlFor="branch">
                    <Select id="branch" value={form.branch} onChange={(e) => update("branch", e.target.value)}>
                      {BRANCHES.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Graduation Year" htmlFor="gradYear">
                    <Input id="gradYear" type="number" value={form.graduationYear} onChange={(e) => update("graduationYear", Number(e.target.value))} />
                  </Field>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <ConfidenceField label="Overall Coding Score" value={form.codingScore} onChange={(v) => update("codingScore", v)} />
                <div>
                  <p className="mb-2.5 text-sm font-semibold text-text">Programming Languages</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <Checkbox key={lang} label={lang} checked={form.languages.includes(lang)} onChange={() => toggleLanguage(lang)} />
                    ))}
                  </div>
                </div>
                <SliderField label="Data Structures" value={form.dsa} onChange={(v) => update("dsa", v)} />
                <SliderField label="Algorithms" value={form.algorithms} onChange={(v) => update("algorithms", v)} />
                <SliderField label="SQL" value={form.sqlScore} onChange={(v) => update("sqlScore", v)} />
                <SliderField label="Web Development" value={form.webDev} onChange={(v) => update("webDev", v)} />
                <SliderField label="Git/GitHub" value={form.gitScore} onChange={(v) => update("gitScore", v)} />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Aptitude</p>
                <ConfidenceField label="Quantitative" value={form.quant} onChange={(v) => update("quant", v)} />
                <ConfidenceField label="Logical Reasoning" value={form.logical} onChange={(v) => update("logical", v)} />
                <ConfidenceField label="Verbal Ability" value={form.verbal} onChange={(v) => update("verbal", v)} />
                <div className="h-px bg-border" />
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Communication</p>
                <ConfidenceField label="English Communication" value={form.communication} onChange={(v) => update("communication", v)} />
                <ConfidenceField label="Interview Confidence" value={form.interviewConfidence} onChange={(v) => update("interviewConfidence", v)} />
                <ConfidenceField label="Presentation Skills" value={form.presentation} onChange={(v) => update("presentation", v)} />
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
                <Field label="Leadership Experience" htmlFor="leadership">
                  <Input id="leadership" type="number" min={0} value={form.leadershipCount} onChange={(e) => update("leadershipCount", Number(e.target.value))} />
                </Field>
              </div>
            ) : null}

            {step === 4 ? (
              <>
                <div>
                  <p className="mb-2.5 text-sm font-semibold text-text">Preferred Role</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CAREER_ROLES.map((role) => (
                      <button
                        type="button"
                        key={role}
                        onClick={() => update("preferredRole", role)}
                        className={`rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
                          form.preferredRole === role
                            ? "border-primary bg-primary-soft text-primary shadow-sm"
                            : "border-border text-text hover:border-primary/30 hover:bg-muted"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <Field label="Preferred Industry" htmlFor="industry">
                  <Select id="industry" value={form.preferredIndustry} onChange={(e) => update("preferredIndustry", e.target.value)}>
                    {INDUSTRIES.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Preferred Work Location" htmlFor="location">
                    <Input id="location" value={form.preferredLocation} onChange={(e) => update("preferredLocation", e.target.value)} placeholder="e.g. Bengaluru" />
                  </Field>
                  <Field label="Expected Salary Range" htmlFor="salary">
                    <Input id="salary" value={form.expectedSalaryRange} onChange={(e) => update("expectedSalaryRange", e.target.value)} placeholder="e.g. 6-10 LPA" />
                  </Field>
                </div>
                <Field label="Target Companies" htmlFor="companies" hint="Comma separated">
                  <Input id="companies" value={form.targetCompanies} onChange={(e) => update("targetCompanies", e.target.value)} placeholder="e.g. TCS, Infosys, Google" />
                </Field>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {error ? (
          <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        ) : null}
      </Card>

      {/* Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-xl lg:bottom-0 lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="hidden text-xs font-bold text-text-secondary sm:block">
            Step {step + 1} of {STEPS.length}
          </span>
          {isLast ? (
            <Button onClick={handleSubmit} className="gap-2">
              <Sparkles className="h-4 w-4" /> Analyze My Readiness
            </Button>
          ) : (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="gap-1.5">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
