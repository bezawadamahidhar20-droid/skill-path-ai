export const BRANCHES = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Other",
];

export const DEGREES = ["B.Tech", "B.E.", "B.Sc", "M.Tech", "M.Sc", "MCA", "Other"];

export const PROGRAMMING_LANGUAGES = ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust"];

export const INDUSTRIES = ["IT Services", "Product Companies", "Startups", "FinTech", "Consulting", "Core Engineering"];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/assessment", label: "Assessment", icon: "ClipboardList" },
  { href: "/results", label: "My Readiness", icon: "Gauge" },
  { href: "/skills", label: "Skill Intelligence", icon: "Radar" },
  { href: "/simulator", label: "What-If Simulator", icon: "SlidersHorizontal" },
  { href: "/roadmap", label: "Career Roadmap", icon: "Map" },
  { href: "/prep", label: "Placement Prep", icon: "BookOpen" },
  { href: "/resume", label: "Resume", icon: "FileText" },
  { href: "/profile", label: "Profile", icon: "User" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const;

export const MOBILE_NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "LayoutDashboard" },
  { href: "/assessment", label: "Assessment", icon: "ClipboardList" },
  { href: "/results", label: "Results", icon: "Gauge" },
  { href: "/simulator", label: "Simulator", icon: "SlidersHorizontal" },
  { href: "/profile", label: "Profile", icon: "User" },
] as const;
