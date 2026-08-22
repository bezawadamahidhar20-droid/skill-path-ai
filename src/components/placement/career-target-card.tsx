"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CAREER_ROLES } from "@/lib/scoring";
import { Target, CheckCircle2, RefreshCw, Briefcase, GraduationCap, Route } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface CareerTargetCardProps {
  targetRole: string;
}

export function CareerTargetCard({ targetRole }: CareerTargetCardProps) {
  const router = useRouter();
  const { push } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(targetRole);
  const [saving, setSaving] = useState(false);

  const roleDetails: Record<string, { coreSkills: string[]; interviewType: string; preparationPath: string }> = {
    "Software Engineer": {
      coreSkills: ["Data Structures & Algorithms", "System Design", "SQL & DBMS", "Git & OOP"],
      interviewType: "Coding Screening + System Architecture + Technical Defense + HR",
      preparationPath: "Algorithmic problem solving & production project evidence",
    },
    "Full Stack Developer": {
      coreSkills: ["Frontend (React/Next)", "Backend (Node/Python)", "REST/GraphQL APIs", "SQL/NoSQL"],
      interviewType: "Live Coding Round + Full Stack Project Review + Technical Architecture",
      preparationPath: "End-to-end full stack deployment & API integration proof",
    },
    "Data Analyst": {
      coreSkills: ["Advanced SQL", "Python (Pandas/NumPy)", "Excel & Tableau/Power BI", "Statistics"],
      interviewType: "SQL Case Study + Data Analysis Test + Business Insights Review",
      preparationPath: "Exploratory data analysis projects & complex SQL query fluency",
    },
    "Data Scientist / AI Engineer": {
      coreSkills: ["Machine Learning", "Python/PyTorch", "Applied Math & Stats", "Feature Engineering"],
      interviewType: "ML Theory + Coding Challenge + Model Evaluation & Defense",
      preparationPath: "ML pipeline implementation & algorithmic model optimization",
    },
    "DevOps / Cloud Engineer": {
      coreSkills: ["Docker & Kubernetes", "CI/CD Pipelines", "Linux & Shell", "AWS/GCP & Terraform"],
      interviewType: "Infrastructure Case Study + Linux Hands-on + Cloud Architecture",
      preparationPath: "Containerized deployment pipelines & cloud infrastructure automation",
    },
    "Product Manager": {
      coreSkills: ["Product Sense & Metrics", "User Wireframing", "Agile & SQL", "Market Strategy"],
      interviewType: "Product Design Case + Analytical Estimation + Behavioral Strategy",
      preparationPath: "Product teardowns, roadmap execution, and metric analysis",
    },
  };

  const currentDetails = roleDetails[targetRole] || roleDetails["Software Engineer"];

  async function handleSaveTarget() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: selectedRole }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        push({ title: "Target Career Updated", description: `Your preparation priority is now focused on ${selectedRole}.`, tone: "success" });
        setOpenModal(false);
        router.refresh();
      } else {
        push({ title: "Update Failed", description: json.error?.message || "Failed to update target role.", tone: "danger" });
      }
    } catch {
      push({ title: "Network Error", description: "Failed to connect to server.", tone: "danger" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Target Career Goal</p>
              <h2 className="text-lg font-bold text-text">{targetRole}</h2>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setOpenModal(true)} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Change
          </Button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Core Skills</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentDetails.coreSkills.map((s) => (
                <span key={s} className="rounded-lg bg-surface px-2 py-0.5 text-[11px] font-semibold text-text border border-border">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Interview Eval</p>
            </div>
            <p className="text-xs font-medium text-text leading-relaxed">{currentDetails.interviewType}</p>
          </div>

          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Route className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Prep Strategy</p>
            </div>
            <p className="text-xs font-medium text-text leading-relaxed">{currentDetails.preparationPath}</p>
          </div>
        </div>
      </Card>

      {openModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <h3 className="text-xl font-bold tracking-tight text-text">Select Your Target Career</h3>
            <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
              Changing your goal dynamically recalculates skill priorities, readiness thresholds, and your roadmap.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {CAREER_ROLES.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm font-semibold transition-all ${
                    selectedRole === role
                      ? "border-primary bg-primary-soft text-primary shadow-sm"
                      : "border-border text-text hover:border-primary/30 hover:bg-muted"
                  }`}
                >
                  <span>{role}</span>
                  {selectedRole === role ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> : null}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
              <Button variant="ghost" size="sm" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button size="sm" loading={saving} onClick={handleSaveTarget}>
                Update Career Goal
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
