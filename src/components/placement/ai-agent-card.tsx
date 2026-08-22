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
    const iconClass = "h-5 w-5 text-primary";
    switch (name) {
      case "Compass":
        return <Compass className={iconClass} />;
      case "Target":
        return <Target className={iconClass} />;
      case "Code2":
        return <Code2 className={iconClass} />;
      case "FileText":
        return <FileText className={iconClass} />;
      case "MessageSquareCode":
        return <MessageSquareCode className={iconClass} />;
      case "Briefcase":
        return <Briefcase className={iconClass} />;
      case "Send":
        return <Send className={iconClass} />;
      case "Mic":
        return <Mic className={iconClass} />;
      default:
        return <Target className={iconClass} />;
    }
  };

  return (
    <Card className="flex flex-col justify-between p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
            {renderIcon(agent.iconName)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-text leading-snug">{agent.name}</h4>
            <p className="text-[11px] font-semibold text-primary">{agent.roleTitle}</p>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">{agent.purpose}</p>

        <div className="rounded-xl bg-muted/50 p-3 border border-border/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Recommended Focus
          </span>
          <p className="mt-1 text-xs font-semibold text-text">{agent.recommendedFocus}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60">
        <Button size="sm" className="w-full justify-between gap-2" onClick={() => onOpen(agent.id)}>
          <span>{agent.actionText}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
