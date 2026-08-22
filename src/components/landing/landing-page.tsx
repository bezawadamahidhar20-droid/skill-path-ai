"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  Sparkles,
  BarChart3,
  Sliders,
  Map,
  Bot,
  ArrowRight,
  CheckCircle2,
  Target,
  TrendingUp,
  Shield,
  Zap,
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  Check,
  Minus,
  ArrowUp,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const features = [
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Placement Readiness Score",
    description:
      "Get a transparent, AI-powered score out of 100 that shows exactly where you stand — not a vague rating, but an explainable metric.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Skill Intelligence & Diagnosis",
    description:
      "Radar charts, score bars, and priority matrices reveal your strengths and skill gaps compared to industry benchmarks for your target role.",
  },
  {
    icon: <Sliders className="h-6 w-6" />,
    title: "What-If Simulator",
    description:
      "Slide your skills up or down and instantly see how each improvement affects your readiness score. Know exactly where to focus.",
  },
  {
    icon: <Map className="h-6 w-6" />,
    title: "Job-Readiness Roadmap",
    description:
      "A personalized 6-stage milestone path tailored to your target role, with actionable next steps and progress tracking.",
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI Coaching Team",
    description:
      "Specialized AI agents — a Skill Coach, Career Advisor, Interview Coach, and Project Mentor — ready to guide you 24/7.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Personalized Recommendations",
    description:
      "Ranked, impact-weighted actions with expected score improvements. No generic advice — everything is tailored to your profile.",
  },
];

const steps = [
  {
    number: "01",
    title: "Complete Your Assessment",
    description:
      "Answer a quick, guided evaluation covering your technical skills, aptitude, communication, and experience.",
  },
  {
    number: "02",
    title: "Get Your Readiness Report",
    description:
      "Receive an explainable AI score with breakdowns, strengths, focus areas, and feature contributions — all transparent.",
  },
  {
    number: "03",
    title: "Follow Your Roadmap",
    description:
      "Work through your personalized milestones, use the simulator to plan improvements, and get coaching from AI agents.",
  },
];

const stats = [
  { value: 6, suffix: "", label: "Skill Categories Analyzed" },
  { value: 6, suffix: "", label: "Roadmap Stages" },
  { value: 4, suffix: "", label: "AI Coaching Agents" },
  { value: 24, suffix: "/7", label: "Available Anytime" },
];

function ScrollCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <span ref={ref} className="text-2xl font-bold text-primary tabular-nums">
      <AnimatedNumber value={inView ? value : 0} duration={1.2} suffix={suffix} />
    </span>
  );
}

const testimonials = [
  {
    quote:
      "The What-If Simulator changed everything. I could finally see that improving my DSA score would have the biggest impact on my readiness.",
    name: "Priya Sharma",
    role: "CS Student, Amity University",
  },
  {
    quote:
      "Instead of guessing what to prepare, I had a clear roadmap with priorities. The AI agents felt like having a personal mentor.",
    name: "Arjun Mehta",
    role: "B.Tech CSE, 3rd Year",
  },
  {
    quote:
      "The readiness score is refreshingly honest. It told me exactly where I stood and what I needed to do — no sugar-coating.",
    name: "Sneha Reddy",
    role: "Pre-Placement Student",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "\u20B90",
    period: "forever",
    description: "Everything you need to assess your placement readiness.",
    highlighted: false,
    cta: "Get Started Free",
    features: [
      { label: "Placement Readiness Assessment", included: true },
      { label: "Skill Intelligence Report", included: true },
      { label: "What-If Simulator", included: true },
      { label: "Job-Readiness Roadmap", included: true },
      { label: "AI Coaching Agents", included: false },
      { label: "Priority Support", included: false },
    ],
  },
  {
    name: "Pro",
    price: "\u20B9199",
    period: "/month",
    description: "Full access to AI coaching and advanced insights.",
    highlighted: true,
    cta: "Start Pro Trial",
    features: [
      { label: "Everything in Free", included: true },
      { label: "AI Coaching Agents (4 specialists)", included: true },
      { label: "Detailed Feature Contributions", included: true },
      { label: "Assessment History & Trends", included: true },
      { label: "Advanced What-If Scenarios", included: true },
      { label: "Priority Support", included: false },
    ],
  },
  {
    name: "Team",
    price: "\u20B9499",
    period: "/month",
    description: "For training cells and placement departments.",
    highlighted: false,
    cta: "Contact Us",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Bulk Student Onboarding", included: true },
      { label: "Admin Dashboard & Analytics", included: true },
      { label: "Custom Branding", included: true },
      { label: "Dedicated Account Manager", included: true },
      { label: "SLA & Priority Support", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Is PlacementIQ really free?",
    a: "Yes. The core placement readiness assessment, skill intelligence report, what-if simulator, and job-readiness roadmap are completely free. AI coaching agents are available on the Pro plan.",
  },
  {
    q: "How accurate is the readiness score?",
    a: "The score is generated by an AI model trained on placement data. It is not a guarantee of placement — it is a transparent, explainable snapshot of where you stand today. Every factor contributing to the score is visible in your results.",
  },
  {
    q: "What does the What-If Simulator do?",
    a: "It lets you adjust your skill scores and instantly see how each change would affect your overall readiness. This helps you prioritize which skills to improve for the biggest impact.",
  },
  {
    q: "Can I retake the assessment?",
    a: "Absolutely. You can retake it anytime and track your progress over time. Your assessment history shows deltas so you can see exactly how much you've improved.",
  },
  {
    q: "What are the AI Coaching Agents?",
    a: "Four specialized AI agents — a Skill Coach, Career Advisor, Interview Coach, and Project Mentor — available 24/7 on the Pro plan. They provide personalized guidance based on your assessment data and target role.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your data is encrypted and never shared with third parties. We follow industry-standard security practices. You can delete your account and data at any time.",
  },
];

const SECTIONS = ["features", "pricing", "faq"] as const;

function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}

function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-[3px]">
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface shadow-lg transition-colors hover:border-primary/30 hover:bg-primary-soft hover:text-primary"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const activeSection = useActiveSection();
  const scrolled = useScrolled();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const navLinkClass = (id: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      activeSection === id
        ? "bg-primary-soft text-primary"
        : "text-text-secondary hover:bg-muted hover:text-text"
    }`;

  const mobileNavLinkClass = (id: string) =>
    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      activeSection === id
        ? "bg-primary-soft text-primary"
        : "text-text-secondary hover:bg-muted hover:text-text"
    }`;

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Nav ─── */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md transition-all duration-300">
        <div className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${scrolled ? "h-13" : "h-16"}`}>
          <div className="flex items-center gap-2.5">
            <div className={`flex items-center justify-center rounded-lg bg-primary font-bold text-white transition-all duration-300 ${scrolled ? "h-7 w-7 text-xs" : "h-8 w-8 text-sm"}`}>
              P
            </div>
            <span className={`font-bold tracking-tight text-text transition-all duration-300 ${scrolled ? "text-base" : "text-lg"}`}>
              PlacementIQ
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 sm:flex">
            <a href="#features" className={navLinkClass("features")}>
              Features
            </a>
            <a href="#pricing" className={navLinkClass("pricing")}>
              Pricing
            </a>
            <a href="#faq" className={navLinkClass("faq")}>
              FAQ
            </a>
            <div className="ml-2 flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-muted hover:text-text sm:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="overflow-hidden border-t border-border sm:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                <a href="#features" onClick={closeMobile} className={mobileNavLinkClass("features")}>
                  Features
                </a>
                <a href="#pricing" onClick={closeMobile} className={mobileNavLinkClass("pricing")}>
                  Pricing
                </a>
                <a href="#faq" onClick={closeMobile} className={mobileNavLinkClass("faq")}>
                  FAQ
                </a>
                <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                  <Link href="/login" onClick={closeMobile}>
                    <Button variant="ghost" size="md" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={closeMobile}>
                    <Button size="md" className="w-full justify-start">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
      <ScrollProgress />
      <BackToTop />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Placement Intelligence
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
              Know Your Placement Readiness.
              <br />
              <span className="text-primary">Improve It.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
              Get an honest, explainable score of how ready you are for placement
              — then follow a personalized roadmap to get placement-ready. No
              guesswork. No vague advice.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link href="/register">
              <Button size="lg" className="min-w-[180px]">
                Start Free Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="min-w-[180px]">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="mx-auto mt-16 grid max-w-xl grid-cols-2 gap-6 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:grid-cols-4 sm:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <ScrollCounter value={stat.value} suffix={stat.suffix} />
                <p className="mt-1 text-xs font-medium text-text-secondary">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Everything You Need to Get Placement Ready
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
              PlacementIQ combines AI-powered scoring, transparent diagnostics,
              and a personalized improvement engine into one platform.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="group rounded-2xl border border-border bg-background p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-text">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-text-secondary">
              Three simple steps from sign-up to a clear improvement plan.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="relative text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-extrabold text-primary">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="pointer-events-none absolute left-[calc(50%+40px)] top-7 hidden h-px w-[calc(100%-80px)] bg-border sm:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why PlacementIQ ─── */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
                Not Another Vague &quot;Readiness&quot; Score
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                PlacementIQ is different. Every score comes with a full
                breakdown — the feature contributions, the reasoning, and
                ranked recommendations with expected impact.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "Explainable AI — understand why your score is what it is",
                  "Feature contributions — see which skills move the needle",
                  "Impact-weighted recommendations — prioritize what matters",
                  "Transparency over hype — honest assessment, real guidance",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button>
                    Try It Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border bg-background p-8"
            >
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: <BarChart3 className="h-5 w-5" />,
                    title: "Transparent Scoring",
                    desc: "Every factor contributing to your score is visible and explained.",
                  },
                  {
                    icon: <TrendingUp className="h-5 w-5" />,
                    title: "Measurable Progress",
                    desc: "Track your improvement over time with assessment history and deltas.",
                  },
                  {
                    icon: <Shield className="h-5 w-5" />,
                    title: "Honest Assessment",
                    desc: "No inflated scores. We tell you exactly where you stand today.",
                  },
                  {
                    icon: <GraduationCap className="h-5 w-5" />,
                    title: "Built for Students",
                    desc: "Designed specifically for Indian university placement preparation.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              What Students Say
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-sm leading-relaxed text-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-bold text-text">{t.name}</p>
                  <p className="text-xs text-text-secondary">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Simple, Student-Friendly Pricing
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-text-secondary">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className={`relative flex flex-col rounded-2xl border p-7 transition-shadow duration-200 ${
                  plan.highlighted
                    ? "border-primary bg-surface shadow-lg shadow-primary/10"
                    : "border-border bg-surface"
                }`}
              >
                {plan.highlighted ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2"
                  >
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="relative rounded-full bg-primary px-4 py-1 text-xs font-bold text-white shadow-md shadow-primary/30"
                    >
                      <span className="relative z-10">Most Popular</span>
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary"
                        animate={{ opacity: [0.4, 0.15, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </motion.div>
                ) : null}
                <p className="text-sm font-bold uppercase tracking-wide text-text-secondary">
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text">
                    {plan.price}
                  </span>
                  {plan.period ? (
                    <span className="text-sm text-text-secondary">
                      {plan.period}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-text-secondary">
                  {plan.description}
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.features.map((f) => (
                    <li
                      key={f.label}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary/40" />
                      )}
                      <span
                        className={
                          f.included ? "text-text" : "text-text-secondary/60"
                        }
                      >
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Link href="/register">
                    <Button
                      variant={plan.highlighted ? "primary" : "outline"}
                      size="lg"
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={fadeUp}
                  className="overflow-hidden rounded-xl border border-border bg-background"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-text">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm leading-relaxed text-text-secondary">
                          {faq.a}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Ready to Know Where You Stand?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              Take the free Placement Readiness Assessment and get a clear,
              honest picture of your readiness — with a roadmap to improve.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="min-w-[200px]">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-white">
              P
            </div>
            <span className="text-sm font-semibold text-text">
              PlacementIQ
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} PlacementIQ. Built with{" "}
            <span className="text-danger">&hearts;</span> for students.
          </p>
        </div>
      </footer>
    </div>
  );
}
