"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toneForScore, formatDate } from "@/lib/utils";

interface StudentRow {
  id: number;
  name: string;
  email: string;
  branch: string | null;
  graduationYear: number | null;
  score: number | null;
  level: string | null;
  assessedAt: string | null;
}

export function StudentsTable({ students }: { students: StudentRow[] }) {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");

  const branches = useMemo(() => Array.from(new Set(students.map((s) => s.branch).filter(Boolean))) as string[], [students]);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branch === "all" || s.branch === branch;
    return matchesSearch && matchesBranch;
  });

  function exportCsv() {
    const header = "Name,Email,Branch,Graduation Year,Score,Level\n";
    const rows = filtered
      .map((s) => `${s.name},${s.email},${s.branch ?? ""},${s.graduationYear ?? ""},${s.score ?? ""},${s.level ?? ""}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <SectionHeader
        title="Student Management"
        description={`${filtered.length} of ${students.length} students`}
        action={
          <button onClick={exportCsv} className="text-sm font-medium text-primary hover:underline">
            Export CSV
          </button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={branch} onChange={(e) => setBranch(e.target.value)} className="sm:w-64">
          <option value="all">All branches</option>
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="pb-2 font-medium">Student</th>
              <th className="pb-2 font-medium">Branch</th>
              <th className="pb-2 font-medium">Grad. Year</th>
              <th className="pb-2 font-medium">Readiness</th>
              <th className="pb-2 font-medium">Last Assessed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="py-3">
                  <p className="font-medium text-text">{s.name}</p>
                  <p className="text-xs text-text-secondary">{s.email}</p>
                </td>
                <td className="py-3 text-text-secondary">{s.branch ?? "—"}</td>
                <td className="py-3 text-text-secondary">{s.graduationYear ?? "—"}</td>
                <td className="py-3">
                  {s.score !== null ? <Badge tone={toneForScore(s.score)}>{s.score}/100</Badge> : <span className="text-text-secondary">No data</span>}
                </td>
                <td className="py-3 text-text-secondary">{s.assessedAt ? formatDate(s.assessedAt) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? <p className="py-8 text-center text-sm text-text-secondary">No students match your filters.</p> : null}
      </div>
    </Card>
  );
}
