"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { UploadCloud, FileText } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/ui/score-bar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { formatDateTime } from "@/lib/utils";
import type { resumeAnalyses } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type ResumeAnalysis = InferSelectModel<typeof resumeAnalyses>;

export function ResumeClient({ latest }: { latest: ResumeAnalysis | null }) {
  const router = useRouter();
  const { push } = useToast();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!/\.(txt|md)$/i.test(file.name) && file.type !== "text/plain") {
      push({
        title: "Unsupported preview",
        description: "For PDF/DOCX, please paste the text content below — we only parse plain text in this demo.",
        tone: "info",
      });
    }
    setFileName(file.name);
    const content = await file.text();
    setText(content.slice(0, 20000));
  }

  async function handleAnalyze() {
    if (text.trim().length < 30) {
      push({ title: "Resume too short", description: "Please paste at least a few lines of your resume.", tone: "danger" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, fileName }),
      });
      const json = await res.json();
      if (!json.success) {
        push({ title: "Analysis failed", description: json.error?.message, tone: "danger" });
        return;
      }
      push({ title: "Resume analyzed", description: `Score: ${json.data.score}/100`, tone: "success" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <SectionHeader title="Upload or Paste Your Resume" description="Supported: plain text paste (PDF/DOCX text can be pasted directly)." />
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary"
        >
          <UploadCloud className="h-7 w-7 text-primary" />
          <p className="text-sm font-medium text-text">Drop your resume file here or click to browse</p>
          <p className="text-xs text-text-secondary">.txt preferred for automatic parsing</p>
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.md,.pdf,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
        <div className="mt-4">
          <Textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your resume text here…"
          />
        </div>
        <Button className="mt-4 w-full" onClick={handleAnalyze} loading={loading}>
          <FileText className="h-4 w-4" /> Analyze Resume
        </Button>
      </Card>

      <Card>
        <SectionHeader title="Resume Intelligence Report" description={latest ? `Last analyzed ${formatDateTime(latest.createdAt)}` : undefined} />
        {!latest ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center text-sm text-text-secondary">
            Analyze your resume to see your ATS score, missing skills and suggestions here.
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4 text-center">
                <p className="text-xs font-medium text-text-secondary">Resume Score</p>
                <p className="mt-1 text-3xl font-semibold text-primary">{latest.score}</p>
                <p className="text-xs text-text-secondary">/100</p>
              </div>
              <div className="rounded-xl border border-border p-4 text-center">
                <p className="text-xs font-medium text-text-secondary">ATS Compatibility</p>
                <p className="mt-1 text-3xl font-semibold text-success">{latest.atsScore}%</p>
              </div>
            </div>

            <div>
              <ScoreBar label="Overall Quality" value={latest.score} />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-text">Detected Skills</p>
              <div className="flex flex-wrap gap-2">
                {latest.detectedSkills.length ? (
                  latest.detectedSkills.map((s) => (
                    <Badge key={s} tone="success">
                      {s}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-text-secondary">No skills detected yet.</span>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-text">Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {latest.missingSkills.map((s) => (
                  <Badge key={s} tone="warning">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-text">Suggestions</p>
              <ul className="flex flex-col gap-2">
                {latest.suggestions.map((s) => (
                  <li key={s} className="text-sm text-text-secondary">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
