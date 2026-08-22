import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Users & Profiles
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("student"), // student | admin | placement_officer
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  college: text("college"),
  degree: text("degree"),
  branch: text("branch"),
  graduationYear: integer("graduation_year"),
  targetRole: text("target_role"),
  preferredIndustry: text("preferred_industry"),
  preferredLocation: text("preferred_location"),
  expectedSalaryRange: text("expected_salary_range"),
  targetCompanies: text("target_companies"),
  github: text("github"),
  linkedin: text("linkedin"),
  portfolio: text("portfolio"),
  leetcode: text("leetcode"),
  codechef: text("codechef"),
  hackerrank: text("hackerrank"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Assessments (append-only history — never overwritten)
// ---------------------------------------------------------------------------

export const assessments = pgTable(
  "assessments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Academic
    cgpa: numeric("cgpa", { precision: 4, scale: 2 }).notNull(),
    attendance: integer("attendance").notNull(),
    backlogs: integer("backlogs").notNull().default(0),
    branch: text("branch").notNull(),
    graduationYear: integer("graduation_year").notNull(),

    // Technical
    codingScore: integer("coding_score").notNull(),
    languages: jsonb("languages").$type<string[]>().notNull().default([]),
    dsa: integer("dsa").notNull(),
    algorithms: integer("algorithms").notNull(),
    sqlScore: integer("sql_score").notNull(),
    webDev: integer("web_dev").notNull(),
    gitScore: integer("git_score").notNull(),

    // Aptitude & communication
    quant: integer("quant").notNull(),
    logical: integer("logical").notNull(),
    verbal: integer("verbal").notNull(),
    communication: integer("communication").notNull(),
    interviewConfidence: integer("interview_confidence").notNull(),
    presentation: integer("presentation").notNull(),

    // Experience
    projectsCount: integer("projects_count").notNull().default(0),
    internshipsCount: integer("internships_count").notNull().default(0),
    certificationsCount: integer("certifications_count").notNull().default(0),
    hackathonsCount: integer("hackathons_count").notNull().default(0),
    openSourceCount: integer("open_source_count").notNull().default(0),
    leadershipCount: integer("leadership_count").notNull().default(0),

    // Career preferences
    preferredRole: text("preferred_role").notNull(),
    preferredIndustry: text("preferred_industry"),
    preferredLocation: text("preferred_location"),
    expectedSalaryRange: text("expected_salary_range"),
    targetCompanies: text("target_companies"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("assessments_user_id_idx").on(table.userId)],
);

// ---------------------------------------------------------------------------
// Predictions (explainable ML-style output tied to an assessment)
// ---------------------------------------------------------------------------

export const predictions = pgTable(
  "predictions",
  {
    id: serial("id").primaryKey(),
    assessmentId: integer("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    modelVersion: text("model_version").notNull(),
    score: integer("score").notNull(),
    level: text("level").notNull(),
    breakdown: jsonb("breakdown").$type<Record<string, number>>().notNull(),
    positiveFactors: jsonb("positive_factors").$type<string[]>().notNull(),
    improvementFactors: jsonb("improvement_factors").$type<string[]>().notNull(),
    featureContributions: jsonb("feature_contributions")
      .$type<{ label: string; value: number }[]>()
      .notNull(),
    recommendations: jsonb("recommendations")
      .$type<
        {
          title: string;
          category: string;
          current: number;
          target: number;
          action: string;
          impact: string;
        }[]
      >()
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("predictions_user_id_idx").on(table.userId)],
);

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    technology: text("technology"),
    githubUrl: text("github_url"),
    liveUrl: text("live_url"),
    role: text("role"),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("projects_user_id_idx").on(table.userId)],
);

// ---------------------------------------------------------------------------
// Roadmap
// ---------------------------------------------------------------------------

export const roadmapTasks = pgTable(
  "roadmap_tasks",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    week: integer("week").notNull(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    description: text("description"),
    status: text("status").notNull().default("not_started"), // not_started | in_progress | completed
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("roadmap_tasks_user_id_idx").on(table.userId)],
);

// ---------------------------------------------------------------------------
// Resume Intelligence
// ---------------------------------------------------------------------------

export const resumeAnalyses = pgTable(
  "resume_analyses",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fileName: text("file_name"),
    rawText: text("raw_text").notNull(),
    score: integer("score").notNull(),
    atsScore: integer("ats_score").notNull(),
    missingSkills: jsonb("missing_skills").$type<string[]>().notNull(),
    detectedSkills: jsonb("detected_skills").$type<string[]>().notNull(),
    suggestions: jsonb("suggestions").$type<string[]>().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("resume_analyses_user_id_idx").on(table.userId)],
);

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type").notNull().default("info"), // info | success | warning
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("notifications_user_id_idx").on(table.userId)],
);

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("audit_logs_user_id_idx").on(table.userId)],
);
