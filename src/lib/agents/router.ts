import { AI_AGENTS, AIAgentDefinition } from "./definitions";

export function routeUserQueryToAgent(query: string): AIAgentDefinition {
  const q = query.toLowerCase();

  if (q.includes("dsa") || q.includes("algorithm") || q.includes("array") || q.includes("leetcode") || q.includes("code")) {
    return AI_AGENTS.find((a) => a.id === "dsa-coach")!;
  }
  if (q.includes("resume") || q.includes("cv") || q.includes("ats") || q.includes("bullet point")) {
    return AI_AGENTS.find((a) => a.id === "resume-agent")!;
  }
  if (q.includes("interview") || q.includes("mock") || q.includes("question") || q.includes("behavioral")) {
    return AI_AGENTS.find((a) => a.id === "interview-coach")!;
  }
  if (q.includes("job") || q.includes("match") || q.includes("fit") || q.includes("description")) {
    return AI_AGENTS.find((a) => a.id === "job-match")!;
  }
  if (q.includes("apply") || q.includes("referral") || q.includes("drive") || q.includes("linkedin")) {
    return AI_AGENTS.find((a) => a.id === "application-coach")!;
  }
  if (q.includes("speak") || q.includes("pitch") || q.includes("communication") || q.includes("presentation")) {
    return AI_AGENTS.find((a) => a.id === "communication-coach")!;
  }
  if (q.includes("career") || q.includes("role") || q.includes("target") || q.includes("goal") || q.includes("path")) {
    return AI_AGENTS.find((a) => a.id === "career-strategist")!;
  }

  return AI_AGENTS.find((a) => a.id === "skill-coach")!;
}
