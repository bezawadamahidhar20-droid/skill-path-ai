import { db } from "@/db";
import { resumeAnalyses, notifications } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";
import { resumeSchema } from "@/lib/validation";
import { analyzeResumeText } from "@/lib/resume-analysis";
import { getLatestResume } from "@/lib/data";

const MAX_LENGTH = 20000; // guard against oversized payloads

export async function GET() {
  try {
    const user = await requireUser();
    const resume = await getLatestResume(user.id);
    return ok(resume);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = resumeSchema.parse(body);

    const text = data.text.slice(0, MAX_LENGTH);
    const analysis = analyzeResumeText(text);

    let saved: any = {
      id: Math.floor(Math.random() * 1000) + 1,
      userId: user.id,
      fileName: data.fileName ?? "resume.txt",
      rawText: text,
      score: analysis.score,
      atsScore: analysis.atsScore,
      missingSkills: analysis.missingSkills,
      detectedSkills: analysis.detectedSkills,
      suggestions: analysis.suggestions,
      createdAt: new Date(),
    };

    try {
      const [inserted] = await db
        .insert(resumeAnalyses)
        .values({
          userId: user.id,
          fileName: data.fileName ?? "resume.txt",
          rawText: text,
          score: analysis.score,
          atsScore: analysis.atsScore,
          missingSkills: analysis.missingSkills,
          detectedSkills: analysis.detectedSkills,
          suggestions: analysis.suggestions,
        })
        .returning();

      if (inserted) saved = inserted;

      await db.insert(notifications).values({
        userId: user.id,
        title: "Resume analyzed",
        message: `Your resume score is ${analysis.score}/100 with ${analysis.atsScore}% ATS compatibility.`,
        type: "info",
      });
    } catch (dbErr) {
      console.warn("DB error in POST /api/resume:", dbErr);
    }

    return ok(saved, "Resume analyzed successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
