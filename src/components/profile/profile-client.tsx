"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { BRANCHES, DEGREES, INDUSTRIES } from "@/lib/constants";
import { CAREER_ROLES } from "@/lib/scoring";
import type { users, profiles, projects as projectsTable } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;
type Profile = InferSelectModel<typeof profiles>;
type Project = InferSelectModel<typeof projectsTable>;

export function ProfileClient({ user, profile, projects: initialProjects }: { user: User; profile: Profile; projects: Project[] }) {
  const router = useRouter();
  const { push } = useToast();
  const [form, setForm] = useState({
    name: user.name,
    college: profile.college ?? "",
    degree: profile.degree ?? DEGREES[0],
    branch: profile.branch ?? BRANCHES[0],
    graduationYear: profile.graduationYear ?? new Date().getFullYear() + 1,
    targetRole: profile.targetRole ?? CAREER_ROLES[0],
    preferredIndustry: profile.preferredIndustry ?? INDUSTRIES[0],
    preferredLocation: profile.preferredLocation ?? "",
    expectedSalaryRange: profile.expectedSalaryRange ?? "",
    targetCompanies: profile.targetCompanies ?? "",
    github: profile.github ?? "",
    linkedin: profile.linkedin ?? "",
    portfolio: profile.portfolio ?? "",
    leetcode: profile.leetcode ?? "",
    codechef: profile.codechef ?? "",
    hackerrank: profile.hackerrank ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [newProject, setNewProject] = useState({ name: "", technology: "", githubUrl: "" });
  const [addingProject, setAddingProject] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        push({ title: "Profile updated", tone: "success" });
        router.refresh();
      } else {
        push({ title: "Update failed", description: json.error?.message, tone: "danger" });
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleAddProject() {
    if (!newProject.name.trim()) return;
    setAddingProject(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      const json = await res.json();
      if (json.success) {
        setProjects((prev) => [json.data, ...prev]);
        setNewProject({ name: "", technology: "", githubUrl: "" });
      }
    } finally {
      setAddingProject(false);
    }
  }

  async function handleDeleteProject(id: number) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <SectionHeader title="Personal Information" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" htmlFor="name">
            <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" value={user.email} disabled />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Academic Information" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="College" htmlFor="college">
            <Input id="college" value={form.college} onChange={(e) => update("college", e.target.value)} />
          </Field>
          <Field label="Degree" htmlFor="degree">
            <Select id="degree" value={form.degree} onChange={(e) => update("degree", e.target.value)}>
              {DEGREES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Branch" htmlFor="branch">
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
      </Card>

      <Card>
        <SectionHeader title="Career Preferences" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Target Role" htmlFor="targetRole">
            <Select id="targetRole" value={form.targetRole} onChange={(e) => update("targetRole", e.target.value)}>
              {CAREER_ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="Preferred Industry" htmlFor="industry">
            <Select id="industry" value={form.preferredIndustry} onChange={(e) => update("preferredIndustry", e.target.value)}>
              {INDUSTRIES.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </Select>
          </Field>
          <Field label="Preferred Location" htmlFor="location">
            <Input id="location" value={form.preferredLocation} onChange={(e) => update("preferredLocation", e.target.value)} />
          </Field>
          <Field label="Expected Salary Range" htmlFor="salary">
            <Input id="salary" value={form.expectedSalaryRange} onChange={(e) => update("expectedSalaryRange", e.target.value)} />
          </Field>
          <Field label="Target Companies" htmlFor="companies">
            <Input id="companies" value={form.targetCompanies} onChange={(e) => update("targetCompanies", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Social Links" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GitHub" htmlFor="github">
            <Input id="github" value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/username" />
          </Field>
          <Field label="LinkedIn" htmlFor="linkedin">
            <Input id="linkedin" value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/in/username" />
          </Field>
          <Field label="Portfolio" htmlFor="portfolio">
            <Input id="portfolio" value={form.portfolio} onChange={(e) => update("portfolio", e.target.value)} />
          </Field>
          <Field label="LeetCode" htmlFor="leetcode">
            <Input id="leetcode" value={form.leetcode} onChange={(e) => update("leetcode", e.target.value)} />
          </Field>
          <Field label="CodeChef" htmlFor="codechef">
            <Input id="codechef" value={form.codechef} onChange={(e) => update("codechef", e.target.value)} />
          </Field>
          <Field label="HackerRank" htmlFor="hackerrank">
            <Input id="hackerrank" value={form.hackerrank} onChange={(e) => update("hackerrank", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Projects" description="Optional project metadata to showcase your work." />
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <Input placeholder="Project name" value={newProject.name} onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))} />
          <Input placeholder="Technology" value={newProject.technology} onChange={(e) => setNewProject((p) => ({ ...p, technology: e.target.value }))} />
          <Input placeholder="GitHub URL" value={newProject.githubUrl} onChange={(e) => setNewProject((p) => ({ ...p, githubUrl: e.target.value }))} />
          <Button onClick={handleAddProject} loading={addingProject} variant="secondary">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-text">{p.name}</p>
                <p className="text-xs text-text-secondary">{p.technology}</p>
              </div>
              <button onClick={() => handleDeleteProject(p.id)} className="text-text-secondary hover:text-danger" aria-label="Remove project">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {projects.length === 0 ? <p className="py-3 text-sm text-text-secondary">No projects added yet.</p> : null}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
