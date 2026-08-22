import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const onboardingSchema = z.object({
  college: z.string().min(2, "College name is required"),
  degree: z.string().min(1, "Degree is required"),
  branch: z.string().min(1, "Branch is required"),
  graduationYear: z.coerce.number().int().min(2020).max(2035),
  cgpa: z.coerce.number().min(0, "CGPA must be between 0 and 10").max(10, "CGPA must be between 0 and 10"),
  attendance: z.coerce.number().min(0).max(100),
  backlogs: z.coerce.number().int().min(0),
  codingScore: z.coerce.number().min(0).max(100),
  quant: z.coerce.number().min(0).max(100),
  communication: z.coerce.number().min(0).max(100),
  projectsCount: z.coerce.number().int().min(0),
  internshipsCount: z.coerce.number().int().min(0),
  certificationsCount: z.coerce.number().int().min(0),
  hackathonsCount: z.coerce.number().int().min(0),
  openSourceCount: z.coerce.number().int().min(0),
  targetRole: z.string().min(1, "Target role is required"),
});

export const assessmentSchema = z.object({
  cgpa: z.coerce.number().min(0, "CGPA must be between 0 and 10").max(10, "CGPA must be between 0 and 10"),
  attendance: z.coerce.number().min(0, "Attendance must be between 0 and 100").max(100),
  backlogs: z.coerce.number().int().min(0, "Backlogs cannot be negative"),
  branch: z.string().min(1, "Branch is required"),
  graduationYear: z.coerce.number().int().min(2020).max(2035),

  codingScore: z.coerce.number().min(0).max(100),
  languages: z.array(z.string()).default([]),
  dsa: z.coerce.number().min(0).max(100),
  algorithms: z.coerce.number().min(0).max(100),
  sqlScore: z.coerce.number().min(0).max(100),
  webDev: z.coerce.number().min(0).max(100),
  gitScore: z.coerce.number().min(0).max(100),

  quant: z.coerce.number().min(0).max(100),
  logical: z.coerce.number().min(0).max(100),
  verbal: z.coerce.number().min(0).max(100),
  communication: z.coerce.number().min(0).max(100),
  interviewConfidence: z.coerce.number().min(0).max(100),
  presentation: z.coerce.number().min(0).max(100),

  projectsCount: z.coerce.number().int().min(0),
  internshipsCount: z.coerce.number().int().min(0),
  certificationsCount: z.coerce.number().int().min(0),
  hackathonsCount: z.coerce.number().int().min(0),
  openSourceCount: z.coerce.number().int().min(0),
  leadershipCount: z.coerce.number().int().min(0),

  preferredRole: z.string().min(1, "Preferred role is required"),
  preferredIndustry: z.string().optional(),
  preferredLocation: z.string().optional(),
  expectedSalaryRange: z.string().optional(),
  targetCompanies: z.string().optional(),

  projects: z
    .array(
      z.object({
        name: z.string().min(1),
        technology: z.string().optional(),
        githubUrl: z.string().optional(),
        liveUrl: z.string().optional(),
        role: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  college: z.string().optional(),
  degree: z.string().optional(),
  branch: z.string().optional(),
  graduationYear: z.coerce.number().int().min(2020).max(2035).optional(),
  targetRole: z.string().optional(),
  preferredIndustry: z.string().optional(),
  preferredLocation: z.string().optional(),
  expectedSalaryRange: z.string().optional(),
  targetCompanies: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  leetcode: z.string().optional(),
  codechef: z.string().optional(),
  hackerrank: z.string().optional(),
});

export const simulatorSchema = z.object({
  cgpa: z.coerce.number().min(0).max(10),
  codingScore: z.coerce.number().min(0).max(100),
  quant: z.coerce.number().min(0).max(100),
  communication: z.coerce.number().min(0).max(100),
  projectsCount: z.coerce.number().min(0).max(30),
  internshipsCount: z.coerce.number().min(0).max(20),
});

export const resumeSchema = z.object({
  fileName: z.string().optional(),
  text: z.string().min(30, "Resume content is too short to analyze"),
});
