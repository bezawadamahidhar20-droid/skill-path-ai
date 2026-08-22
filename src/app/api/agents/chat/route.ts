import { requireUser } from "@/lib/auth";
import { ok, handleApiError, fail } from "@/lib/api-response";
import { getAgentById } from "@/lib/agents/definitions";
import { buildAgentContextSummary, type AgentContext } from "@/lib/agents/context";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const { agentId, message, context } = body as {
      agentId: string;
      message: string;
      context?: AgentContext;
    };

    if (!message || typeof message !== "string") {
      return fail("VALIDATION_ERROR", "Message is required", 400);
    }

    const agent = getAgentById(agentId);
    const contextSummary = context ? buildAgentContextSummary(context) : `User: ${user.name}, Role: Student`;

    const lower = message.toLowerCase();
    let replyMessage = "";
    let recommendedTask: {
      title: string;
      category: string;
      description: string;
    } | null = null;

    if (agent.id === "dsa-coach") {
      replyMessage = `**${agent.name}**: Based on your target role (${context?.targetRole || "Software Engineer"}), let's focus on algorithmic problem solving.\n\nKey pattern: **Arrays & Hashing / Two Pointers**.\n- Start by identifying key invariants.\n- Analyze time complexity before writing code.\n- Consider edge cases like empty inputs or integer overflow.`;
      if (lower.includes("task") || lower.includes("roadmap") || lower.includes("practice") || lower.includes("array")) {
        recommendedTask = {
          title: "Master Array & Hashing Patterns",
          category: "DSA & Coding",
          description: "Complete 5 guided problems on Two Pointers and Hash Map optimization.",
        };
      }
    } else if (agent.id === "resume-agent") {
      replyMessage = `**${agent.name}**: To improve your ATS score for ${context?.targetRole || "Software Engineer"}:\n1. Start bullet points with strong action verbs (e.g., *Architected*, *Optimized*, *Engineered*).\n2. Quantify results (e.g., *Reduced API latency by 35%*).\n3. Match core tech stack keywords from job descriptions.`;
      if (lower.includes("audit") || lower.includes("task") || lower.includes("bullet") || lower.includes("resume")) {
        recommendedTask = {
          title: "Refine Resume Bullet Points for ATS",
          category: "Resume & Portfolio",
          description: "Rewrite project descriptions using action verbs and measurable metrics.",
        };
      }
    } else if (agent.id === "interview-coach") {
      replyMessage = `**${agent.name}**: For technical & behavioral interviews, structure your response using the **STAR Method**:\n- **Situation**: Context of the problem\n- **Task**: Your specific responsibility\n- **Action**: Engineering decisions and implementation\n- **Result**: Quantifiable output or lesson learned`;
      if (lower.includes("prep") || lower.includes("practice") || lower.includes("mock") || lower.includes("task")) {
        recommendedTask = {
          title: "Practice Project Defense Answers",
          category: "Interview Preparation",
          description: "Prepare 3-minute structured explanations for architecture tradeoffs in your main project.",
        };
      }
    } else if (agent.id === "career-strategist") {
      replyMessage = `**${agent.name}**: Your target path as a **${context?.targetRole || "Software Engineer"}** requires a balanced focus on core CS fundamentals, production projects, and interview readiness.\n\nPriority strategy: Strengthen your weakest priority gap first to pass automated technical screening rounds.`;
      recommendedTask = {
        title: "Review Target Role Skill Benchmarks",
        category: "Career Strategy",
        description: "Audit required technical skills for 3 target employer job descriptions.",
      };
    } else {
      replyMessage = `**${agent.name}**: Recommending focused practice for ${context?.targetRole || "your target role"}.\n\nBreak your preparation into 3 steps: 1) Concept review, 2) Hands-on implementation, 3) Evaluation & evidence.`;
      recommendedTask = {
        title: `Targeted Practice: ${agent.recommendedFocus}`,
        category: "Skill Development",
        description: `Complete focused practice recommended by ${agent.name}.`,
      };
    }

    return ok({
      agentId: agent.id,
      agentName: agent.name,
      reply: replyMessage,
      contextSummary,
      recommendedTask,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
