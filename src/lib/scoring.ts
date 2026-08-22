// ---------------------------------------------------------------------------
// PlacementIQ Readiness Engine
// ---------------------------------------------------------------------------
// This is an explainable, weighted feature-contribution model. It is NOT a
// trained statistical model — it is documented and versioned like one so it
// can be swapped for a scikit-learn service later without changing the API
// contract. Every contribution below is transparent and traceable, which is
// why we call the output a "Placement Readiness Score" rather than a
// probability of employment.
// ---------------------------------------------------------------------------

export const MODEL_VERSION = "heuristic_v1";

export interface AssessmentInput {
  cgpa: number; // 0-10
  attendance: number; // 0-100
  backlogs: number; // >= 0
  codingScore: number; // 0-100
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
  preferredRole?: string;
}

export type Category = "academic" | "technical" | "communication" | "experience";

interface FeatureDef {
  key: keyof AssessmentInput;
  label: string;
  category: Category;
  weight: number; // contribution weight out of 1.0 total
  normalize: (raw: number) => number; // -> 0-100
}

const countScore = (value: number, target: number) => Math.max(0, Math.min(100, (value / target) * 100));
const directScore = (value: number) => Math.max(0, Math.min(100, value));

export const FEATURE_DEFS: FeatureDef[] = [
  { key: "cgpa", label: "CGPA", category: "academic", weight: 0.14, normalize: (v) => directScore((v / 10) * 100) },
  { key: "attendance", label: "Attendance", category: "academic", weight: 0.06, normalize: directScore },
  {
    key: "backlogs",
    label: "Active Backlogs",
    category: "academic",
    weight: 0.05,
    normalize: (v) => Math.max(0, 100 - Math.min(v, 4) * 25),
  },
  { key: "codingScore", label: "Coding", category: "technical", weight: 0.09, normalize: directScore },
  { key: "dsa", label: "Data Structures", category: "technical", weight: 0.06, normalize: directScore },
  { key: "algorithms", label: "Algorithms", category: "technical", weight: 0.05, normalize: directScore },
  { key: "sqlScore", label: "SQL", category: "technical", weight: 0.04, normalize: directScore },
  { key: "webDev", label: "Web Development", category: "technical", weight: 0.03, normalize: directScore },
  { key: "gitScore", label: "Git/GitHub", category: "technical", weight: 0.03, normalize: directScore },
  { key: "quant", label: "Quantitative Aptitude", category: "communication", weight: 0.035, normalize: directScore },
  { key: "logical", label: "Logical Reasoning", category: "communication", weight: 0.035, normalize: directScore },
  { key: "verbal", label: "Verbal Ability", category: "communication", weight: 0.03, normalize: directScore },
  { key: "communication", label: "Communication", category: "communication", weight: 0.04, normalize: directScore },
  {
    key: "interviewConfidence",
    label: "Interview Confidence",
    category: "communication",
    weight: 0.03,
    normalize: directScore,
  },
  { key: "presentation", label: "Presentation Skills", category: "communication", weight: 0.03, normalize: directScore },
  { key: "projectsCount", label: "Projects", category: "experience", weight: 0.08, normalize: (v) => countScore(v, 6) },
  {
    key: "internshipsCount",
    label: "Internships",
    category: "experience",
    weight: 0.06,
    normalize: (v) => countScore(v, 3),
  },
  {
    key: "certificationsCount",
    label: "Certifications",
    category: "experience",
    weight: 0.04,
    normalize: (v) => countScore(v, 4),
  },
  {
    key: "hackathonsCount",
    label: "Hackathons",
    category: "experience",
    weight: 0.03,
    normalize: (v) => countScore(v, 4),
  },
  {
    key: "openSourceCount",
    label: "Open Source Contributions",
    category: "experience",
    weight: 0.02,
    normalize: (v) => countScore(v, 5),
  },
  {
    key: "leadershipCount",
    label: "Leadership Experience",
    category: "experience",
    weight: 0.02,
    normalize: (v) => countScore(v, 3),
  },
];

export const CATEGORY_WEIGHTS: Record<Category, number> = {
  academic: 0.25,
  technical: 0.3,
  communication: 0.2,
  experience: 0.25,
};

export const CATEGORY_LABELS: Record<Category, string> = {
  academic: "Academic",
  technical: "Technical",
  communication: "Communication",
  experience: "Experience",
};

export interface ReadinessLevel {
  min: number;
  max: number;
  label: string;
  tone: "danger" | "warning" | "success" | "primary";
}

export const READINESS_LEVELS: ReadinessLevel[] = [
  { min: 0, max: 39, label: "Needs Significant Improvement", tone: "danger" },
  { min: 40, max: 59, label: "Developing", tone: "warning" },
  { min: 60, max: 74, label: "Placement Ready", tone: "primary" },
  { min: 75, max: 89, label: "Strong Placement Readiness", tone: "success" },
  { min: 90, max: 100, label: "Excellent Readiness", tone: "success" },
];

export function levelForScore(score: number): ReadinessLevel {
  return (
    READINESS_LEVELS.find((l) => score >= l.min && score <= l.max) ?? READINESS_LEVELS[0]
  );
}

export interface FeatureContribution {
  key: string;
  label: string;
  category: Category;
  normalized: number;
  weight: number;
  contribution: number; // points out of 100
}

export interface Recommendation {
  title: string;
  category: Category;
  current: number;
  target: number;
  action: string;
  impact: string;
}

export interface ReadinessResult {
  score: number;
  level: ReadinessLevel;
  breakdown: Record<Category, number>;
  contributions: FeatureContribution[];
  positiveFactors: string[];
  improvementFactors: string[];
  recommendations: Recommendation[];
}

function computeContributions(input: AssessmentInput): FeatureContribution[] {
  return FEATURE_DEFS.map((f) => {
    const raw = Number(input[f.key] ?? 0);
    const normalized = f.normalize(raw);
    return {
      key: f.key as string,
      label: f.label,
      category: f.category,
      normalized,
      weight: f.weight,
      contribution: Number((f.weight * normalized).toFixed(2)),
    };
  });
}

const ACTIONS: Record<string, (current: number, target: number) => string> = {
  cgpa: () => "Aim for consistent grades this semester and clear pending coursework.",
  attendance: () => "Improve class attendance to stay above 85% for placement eligibility.",
  backlogs: () => "Prioritize clearing backlog subjects before your final placement drive.",
  codingScore: () => "Solve 5 coding problems daily on a platform like LeetCode or HackerRank.",
  dsa: () => "Complete a structured DSA sheet covering arrays, strings, hashing, trees and graphs.",
  algorithms: () => "Study core algorithm patterns: sorting, searching, greedy, DP and recursion.",
  sqlScore: () => "Practice SQL joins, aggregations and window functions on real datasets.",
  webDev: () => "Build 1-2 full-stack projects using a modern web framework.",
  gitScore: () => "Practice Git workflows: branching, pull requests and resolving merge conflicts.",
  quant: () => "Complete 20 quantitative aptitude questions per day for the next 14 days.",
  logical: () => "Practice logical reasoning puzzles daily using timed mock tests.",
  verbal: () => "Read daily and practice verbal ability mock tests to build vocabulary and grammar.",
  communication: () => "Join a communication workshop or practice speaking English daily with peers.",
  interviewConfidence: () => "Do 3 mock interviews this month with structured feedback.",
  presentation: () => "Practice presenting your projects in under 3 minutes to a peer group.",
  projectsCount: () => "Build one new project that solves a real-world problem end to end.",
  internshipsCount: () => "Apply to at least 5 relevant internships this month.",
  certificationsCount: () => "Complete one recognized certification in your target domain.",
  hackathonsCount: () => "Participate in at least one hackathon this quarter.",
  openSourceCount: () => "Make your first open-source contribution — start with a documentation fix.",
  leadershipCount: () => "Take up a lead role in a club, project team or student community.",
};

function computeRecommendations(contributions: FeatureContribution[]): Recommendation[] {
  const weak = [...contributions]
    .filter((c) => c.normalized < 85)
    .sort((a, b) => a.normalized * a.weight - b.normalized * b.weight)
    .slice(0, 5);

  return weak.map((c) => {
    const target = Math.min(100, Math.round(c.normalized + 15));
    const impactLow = Number((c.weight * (target - c.normalized) * 0.6).toFixed(1));
    const impactHigh = Number((c.weight * (target - c.normalized)).toFixed(1));
    return {
      title: `Improve ${c.label}`,
      category: c.category,
      current: Math.round(c.normalized),
      target,
      action: ACTIONS[c.key]?.(c.normalized, target) ?? `Focus on improving ${c.label.toLowerCase()}.`,
      impact: `+${impactLow} to +${impactHigh} readiness points`,
    };
  });
}

export function computeReadiness(input: AssessmentInput): ReadinessResult {
  const contributions = computeContributions(input);
  const score = Math.round(contributions.reduce((sum, c) => sum + c.contribution, 0));

  const breakdown = (Object.keys(CATEGORY_WEIGHTS) as Category[]).reduce(
    (acc, cat) => {
      const catContribution = contributions
        .filter((c) => c.category === cat)
        .reduce((s, c) => s + c.contribution, 0);
      acc[cat] = Math.round((catContribution / CATEGORY_WEIGHTS[cat]) * 10) / 10;
      return acc;
    },
    {} as Record<Category, number>,
  );

  const sortedByPerformance = [...contributions].sort((a, b) => b.normalized - a.normalized);
  const positiveFactors = sortedByPerformance
    .filter((c) => c.normalized >= 70)
    .slice(0, 4)
    .map((c) => c.label);
  const improvementFactors = sortedByPerformance
    .filter((c) => c.normalized < 75)
    .slice(-4)
    .reverse()
    .map((c) => c.label);

  return {
    score: Math.max(0, Math.min(100, score)),
    level: levelForScore(score),
    breakdown,
    contributions,
    positiveFactors: positiveFactors.length ? positiveFactors : ["Keep building your profile"],
    improvementFactors: improvementFactors.length ? improvementFactors : ["Maintain your current momentum"],
    recommendations: computeRecommendations(contributions),
  };
}

// ---------------------------------------------------------------------------
// What-If Simulator
// ---------------------------------------------------------------------------

export interface SimulatorField {
  key: keyof AssessmentInput;
  label: string;
  min: number;
  max: number;
  step: number;
}

export const SIMULATOR_FIELDS: SimulatorField[] = [
  { key: "cgpa", label: "CGPA", min: 0, max: 10, step: 0.1 },
  { key: "codingScore", label: "Coding", min: 0, max: 100, step: 1 },
  { key: "quant", label: "Aptitude", min: 0, max: 100, step: 1 },
  { key: "communication", label: "Communication", min: 0, max: 100, step: 1 },
  { key: "projectsCount", label: "Projects", min: 0, max: 12, step: 1 },
  { key: "internshipsCount", label: "Internships", min: 0, max: 6, step: 1 },
];

export function simulate(base: AssessmentInput, target: AssessmentInput) {
  const current = computeReadiness(base);
  const projected = computeReadiness(target);

  const perField = SIMULATOR_FIELDS.map((f) => {
    const withOnlyThisChanged: AssessmentInput = { ...base, [f.key]: target[f.key] };
    const result = computeReadiness(withOnlyThisChanged);
    return {
      key: f.key,
      label: f.label,
      delta: Number((result.score - current.score).toFixed(1)),
    };
  }).sort((a, b) => b.delta - a.delta);

  return {
    current: current.score,
    projected: projected.score,
    delta: Number((projected.score - current.score).toFixed(1)),
    currentLevel: current.level,
    projectedLevel: projected.level,
    highestImpact: perField[0],
    perField,
  };
}

// ---------------------------------------------------------------------------
// Skill Intelligence — target levels by career goal
// ---------------------------------------------------------------------------

export const CAREER_ROLES = [
  "Software Developer",
  "Data Analyst",
  "Data Scientist",
  "AI/ML Engineer",
  "Web Developer",
  "Cloud Engineer",
  "Other",
] as const;

export type CareerRole = (typeof CAREER_ROLES)[number];

export const ROLE_SKILL_TARGETS: Record<CareerRole, Record<string, number>> = {
  "Software Developer": { Coding: 85, DSA: 85, Algorithms: 80, SQL: 70, "Web Development": 65, "Git/GitHub": 80 },
  "Data Analyst": { Coding: 65, DSA: 55, Algorithms: 50, SQL: 90, "Web Development": 40, "Git/GitHub": 65 },
  "Data Scientist": { Coding: 75, DSA: 65, Algorithms: 70, SQL: 80, "Web Development": 40, "Git/GitHub": 70 },
  "AI/ML Engineer": { Coding: 85, DSA: 75, Algorithms: 85, SQL: 65, "Web Development": 45, "Git/GitHub": 75 },
  "Web Developer": { Coding: 75, DSA: 55, Algorithms: 50, SQL: 60, "Web Development": 90, "Git/GitHub": 80 },
  "Cloud Engineer": { Coding: 70, DSA: 55, Algorithms: 55, SQL: 65, "Web Development": 55, "Git/GitHub": 80 },
  Other: { Coding: 75, DSA: 65, Algorithms: 65, SQL: 65, "Web Development": 65, "Git/GitHub": 70 },
};

export function skillTargetsForRole(role?: string | null): Record<string, number> {
  if (role && role in ROLE_SKILL_TARGETS) return ROLE_SKILL_TARGETS[role as CareerRole];
  return ROLE_SKILL_TARGETS.Other;
}

// ---------------------------------------------------------------------------
// Roadmap generation
// ---------------------------------------------------------------------------

export interface RoadmapTaskSeed {
  week: number;
  title: string;
  category: Category;
  description: string;
  orderIndex: number;
}

export function generateRoadmap(result: ReadinessResult): RoadmapTaskSeed[] {
  const weakest = [...result.contributions].sort((a, b) => a.normalized - b.normalized).slice(0, 4);

  return weakest.map((c, idx) => ({
    week: idx + 1,
    title: `${CATEGORY_LABELS[c.category]}: Improve ${c.label}`,
    category: c.category,
    description: ACTIONS[c.key]?.(c.normalized, c.normalized + 15) ?? `Focus on ${c.label.toLowerCase()} this week.`,
    orderIndex: idx,
  }));
}
