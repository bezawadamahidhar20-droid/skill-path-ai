import Link from "next/link";
import { requirePageUser } from "@/lib/auth";
import { getLatestAssessment, getProfile } from "@/lib/data";
import { PageTransition } from "@/components/animations/page-transition";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger";
import { Card, SectionHeader } from "@/components/ui/card";
import { ScoreBar } from "@/components/ui/score-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { classifySkillScore, getSkillLevelTone } from "@/lib/skill-classification";

export const dynamic = "force-dynamic";

export default async function PrepPage() {
  const user = await requirePageUser();
  const [assessment, profile] = await Promise.all([getLatestAssessment(user.id), getProfile(user.id)]);

  const targetRole = profile?.targetRole || assessment?.preferredRole || "Software Engineer";

  const prepDimensions = [
    { key: "dsa", title: "Data Structures & Algorithms", score: assessment ? Math.round((assessment.dsa + assessment.algorithms) / 2) : 55, focus: "Arrays, Two-Pointers, Hashing, Trees & Graphs" },
    { key: "aptitude", title: "Aptitude & Problem Solving", score: assessment ? Math.round((assessment.quant + assessment.logical) / 2) : 60, focus: "Quantitative puzzles, probability, logical reasoning" },
    { key: "technical", title: "Technical Interview & Systems", score: assessment ? assessment.codingScore : 65, focus: "Architecture tradeoffs, OOP, system design concepts" },
    { key: "hr", title: "HR & Behavioral Rounds", score: assessment ? assessment.interviewConfidence : 70, focus: "STAR method, leadership examples, career alignment" },
    { key: "communication", title: "Technical Communication", score: assessment ? assessment.communication : 65, focus: "Concise project explanations and active listening" },
    { key: "resume", title: "Resume & Portfolio Evidence", score: assessment ? assessment.presentation : 75, focus: "ATS keyword matching and quantifiable project bullet points" },
  ];

  return (
    <PageTransition>
      <SectionHeader
        title="Placement Preparation Center"
        description={`Targeted preparation dimensions for your ${targetRole} path.`}
      />
      <StaggerContainer className="grid gap-4 sm:grid-cols-2">
        {prepDimensions.map((section) => {
          const level = classifySkillScore(section.score);
          const tone = getSkillLevelTone(level);
          return (
            <StaggerItem key={section.key}>
              <Card className="flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-text">{section.title}</h3>
                    <Badge tone={tone.badge}>{level}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-text-secondary">
                    <strong className="text-text">Key Focus:</strong> {section.focus}
                  </p>
                  <div className="mt-3">
                    <ScoreBar label="" value={section.score} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex justify-end">
                  <Link href="/roadmap">
                    <Button variant="outline" size="sm">
                      Work on Stage →
                    </Button>
                  </Link>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageTransition>
  );
}
