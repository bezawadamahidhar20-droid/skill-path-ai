export type SkillLevel = "Below Average" | "Average" | "Good" | "Perfect";
export type PriorityLevel = "HIGH PRIORITY" | "MEDIUM PRIORITY" | "MAINTAIN";

export interface PrioritizedSkill {
  id: string;
  name: string;
  level: SkillLevel;
  priority: PriorityLevel;
  whyItMatters: string;
  whatToDoNext: string;
  recommendedAgentId: string;
  score: number;
}

export function classifySkillScore(score: number): SkillLevel {
  if (score < 50) return "Below Average";
  if (score < 70) return "Average";
  if (score < 88) return "Good";
  return "Perfect";
}

export function getSkillLevelTone(level: SkillLevel): {
  badge: "danger" | "warning" | "primary" | "success";
  bg: string;
  text: string;
  border: string;
} {
  switch (level) {
    case "Below Average":
      return {
        badge: "danger" as const,
        bg: "bg-danger/10",
        text: "text-danger",
        border: "border-danger/20",
      };
    case "Average":
      return {
        badge: "warning" as const,
        bg: "bg-warning/10",
        text: "text-warning",
        border: "border-warning/20",
      };
    case "Good":
      return {
        badge: "primary" as const,
        bg: "bg-primary-soft",
        text: "text-primary",
        border: "border-primary/20",
      };
    case "Perfect":
      return {
        badge: "success" as const,
        bg: "bg-success/10",
        text: "text-success",
        border: "border-success/20",
      };
  }
}

export function getRoleSkillPriorities(
  targetRole: string = "Software Engineer",
  assessmentData: Record<string, any> = {}
): PrioritizedSkill[] {
  const codingScore = Number(assessmentData.codingScore ?? 60);
  const dsaScore = Number(assessmentData.dsa ?? codingScore - 5);
  const sqlScore = Number(assessmentData.sqlScore ?? codingScore - 8);
  const webDevScore = Number(assessmentData.webDev ?? codingScore - 3);
  const quantScore = Number(assessmentData.quant ?? 65);
  const communicationScore = Number(assessmentData.communication ?? 65);
  const projectsCount = Number(assessmentData.projectsCount ?? 1);

  const resumeScore = Math.min(100, projectsCount * 25 + (assessmentData.internshipsCount ? 35 : 15));

  const role = targetRole.toLowerCase();

  const allSkills: PrioritizedSkill[] = [
    {
      id: "dsa",
      name: "Data Structures & Algorithms",
      level: classifySkillScore(dsaScore),
      priority: role.includes("software") || role.includes("backend") ? "HIGH PRIORITY" : "MEDIUM PRIORITY",
      whyItMatters: "Frequently assessed in technical screening rounds for engineering roles.",
      whatToDoNext: "Practice array, hashing, and two-pointer pattern recognition.",
      recommendedAgentId: "dsa-coach",
      score: dsaScore,
    },
    {
      id: "problem-solving",
      name: "Problem Solving & Aptitude",
      level: classifySkillScore(quantScore),
      priority: role.includes("analyst") || role.includes("consultant") ? "HIGH PRIORITY" : "MEDIUM PRIORITY",
      whyItMatters: "Determines speed and accuracy during initial cognitive and quantitative rounds.",
      whatToDoNext: "Complete timed sets on probability, logic, and quantitative puzzles.",
      recommendedAgentId: "skill-coach",
      score: quantScore,
    },
    {
      id: "sql",
      name: "SQL & Data Fundamentals",
      level: classifySkillScore(sqlScore),
      priority: role.includes("data") || role.includes("backend") || role.includes("full stack") ? "HIGH PRIORITY" : "MEDIUM PRIORITY",
      whyItMatters: "Essential for database querying, schema design, and backend data manipulation.",
      whatToDoNext: "Master JOINs, GROUP BY aggregations, and window functions.",
      recommendedAgentId: "skill-coach",
      score: sqlScore,
    },
    {
      id: "web-dev",
      name: "Full Stack Development & System Design",
      level: classifySkillScore(webDevScore),
      priority: role.includes("full stack") || role.includes("frontend") || role.includes("web") ? "HIGH PRIORITY" : "MEDIUM PRIORITY",
      whyItMatters: "Demonstrates practical production-grade engineering and architectural capability.",
      whatToDoNext: "Deploy a full-stack project with secure API routes and database state.",
      recommendedAgentId: "skill-coach",
      score: webDevScore,
    },
    {
      id: "communication",
      name: "Technical Communication & Behavioral",
      level: classifySkillScore(communicationScore),
      priority: "MEDIUM PRIORITY",
      whyItMatters: "Crucial for articulating technical decisions cleanly during recruiter and HM rounds.",
      whatToDoNext: "Practice structured STAR-method explanations for past projects and tradeoffs.",
      recommendedAgentId: "communication-coach",
      score: communicationScore,
    },
    {
      id: "resume-quality",
      name: "Resume & Project Evidence",
      level: classifySkillScore(resumeScore),
      priority: "HIGH PRIORITY",
      whyItMatters: "Required for passing automated ATS filters and getting recruiter callbacks.",
      whatToDoNext: "Refine project bullet points with quantifiable impact metrics and keywords.",
      recommendedAgentId: "resume-agent",
      score: resumeScore,
    },
  ];

  // Sort by priority rank (HIGH PRIORITY first, then lower scores)
  return allSkills.sort((a, b) => {
    const pRank = (p: PriorityLevel) => (p === "HIGH PRIORITY" ? 0 : p === "MEDIUM PRIORITY" ? 1 : 2);
    if (pRank(a.priority) !== pRank(b.priority)) {
      return pRank(a.priority) - pRank(b.priority);
    }
    return a.score - b.score;
  });
}
