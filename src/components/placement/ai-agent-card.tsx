import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AIAgentDefinition } from "@/lib/agents/definitions";
import {
  Compass,
  Target,
  Code2,
  FileText,
  MessageSquareCode,
  Briefcase,
  Send,
  Mic,
  ArrowRight,
} from "lucide-react";

interface AIAgentCardProps {
  agent: AIAgentDefinition;
  onOpen: (agentId: string) => void;
}

export function AIAgentCard({ agent, onOpen }: AIAgentCardProps) {
  const renderIcon = (name: string) => {
    switch (name) {
      case "Compass":
        return <Compass className="h-5 w-5 text-primary" />;
      case "Target":
        return <Target className="h-5 w-5 text-primary" />;
      case "Code2":
        return <Code2 className="h-5 w-5 text-primary" />;
      case "FileText":
        return <FileText className="h-5 w-5 text-primary" />;
      case "MessageSquareCode":
        return <MessageSquareCode className="h-5 w-5 text-primary" />;
      case "Briefcase":
        return <Briefcase className="h-5 w-5 text-primary" />;
      case "Send":
        return <Send className="h-5 w-5 text-primary" />;
      case "Mic":
        return <Mic className="h-5 w-5 text-primary" />;
      default:
        return <Target className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="flex flex-col justify-between p-5 transition-all hover:border-primary/40 hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
            {renderIcon(agent.iconName)}
          </div>
          <div>
            <h4 className="text-base font-bold text-text leading-snug">{agent.name}</h4>
            <p className="text-xs font-semibold text-primary">{agent.roleTitle}</p>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">{agent.purpose}</p>

        <div className="rounded-lg bg-background p-2.5 border border-border/50 text-[11px]">
          <span className="font-semibold text-text-secondary uppercase tracking-wider text-[10px]">
            Recommended Focus:
          </span>
          <p className="mt-0.5 font-medium text-text">{agent.recommendedFocus}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60">
        <Button size="sm" className="w-full justify-between" onClick={() => onOpen(agent.id)}>
          <span>{agent.actionText}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
