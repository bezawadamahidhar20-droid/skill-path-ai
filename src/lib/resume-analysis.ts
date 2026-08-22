// Lightweight, explainable resume intelligence. Accepts plain text (pasted
// resume content) and produces an ATS-style score, detected/missing skills
// and improvement suggestions. This avoids trusting uploaded binary content
// blindly and keeps the pipeline transparent.

const SKILL_KEYWORDS = [
  "python",
  "java",
  "javascript",
  "typescript",
  "c++",
  "sql",
  "react",
  "node",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "git",
  "linux",
  "machine learning",
  "data structures",
  "algorithms",
  "system design",
  "rest api",
  "html",
  "css",
  "mongodb",
  "postgresql",
  "django",
  "flask",
  "spring",
  "ci/cd",
  "testing",
  "agile",
];

const ATS_SIGNALS = {
  email: /[\w.+-]+@[\w-]+\.[\w.-]+/,
  phone: /(\+?\d[\d\s-]{8,}\d)/,
  education: /(b\.?tech|bachelor|b\.?e\.|degree|university|college)/i,
  experience: /(intern|experience|worked|developed|built|led)/i,
  projects: /project/i,
  links: /(github\.com|linkedin\.com)/i,
  metrics: /(\d+%|\d+x|increased|reduced|improved)/i,
};

export interface ResumeAnalysisResult {
  score: number;
  atsScore: number;
  detectedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}

export function analyzeResumeText(text: string): ResumeAnalysisResult {
  const lower = text.toLowerCase();

  const detectedSkills = SKILL_KEYWORDS.filter((skill) => lower.includes(skill)).map(
    (s) => s.charAt(0).toUpperCase() + s.slice(1),
  );
  const missingSkills = ["SQL", "Docker", "System Design", "Git"].filter(
    (s) => !detectedSkills.some((d) => d.toLowerCase() === s.toLowerCase()),
  );

  let atsScore = 40;
  const suggestions: string[] = [];

  if (ATS_SIGNALS.email.test(text)) atsScore += 10;
  else suggestions.push("Add a professional email address so recruiters can reach you.");

  if (ATS_SIGNALS.phone.test(text)) atsScore += 8;
  else suggestions.push("Add a contact phone number.");

  if (ATS_SIGNALS.education.test(text)) atsScore += 10;
  else suggestions.push("Clearly mention your degree, college and graduation year.");

  if (ATS_SIGNALS.experience.test(text)) atsScore += 10;
  else suggestions.push("Add an experience or internship section with action verbs.");

  if (ATS_SIGNALS.projects.test(text)) atsScore += 8;
  else suggestions.push("Add a dedicated projects section.");

  if (ATS_SIGNALS.links.test(text)) atsScore += 6;
  else suggestions.push("Add your GitHub and LinkedIn links.");

  if (ATS_SIGNALS.metrics.test(text)) atsScore += 8;
  else suggestions.push("Add measurable project outcomes (e.g. 'reduced load time by 30%').");

  if (text.length < 800) suggestions.push("Your resume looks short — expand on your projects and impact.");
  if (text.length > 6000) suggestions.push("Your resume looks long — aim for a concise 1-2 page format.");

  if (detectedSkills.length < 5) suggestions.push("List more of your technical skills explicitly.");

  atsScore = Math.max(0, Math.min(100, atsScore));

  const skillScore = Math.min(100, detectedSkills.length * 6);
  const score = Math.round(atsScore * 0.6 + skillScore * 0.4);

  if (!suggestions.length) suggestions.push("Great resume! Keep it updated with your latest projects and achievements.");

  return {
    score: Math.max(0, Math.min(100, score)),
    atsScore,
    detectedSkills: Array.from(new Set(detectedSkills)),
    missingSkills,
    suggestions: suggestions.slice(0, 6),
  };
}
