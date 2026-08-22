"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AI_AGENTS, getAgentById } from "@/lib/agents/definitions";
import type { AgentContext } from "@/lib/agents/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { Bot, Send, X, PlusCircle, CheckCircle2, Sparkles } from "lucide-react";

interface AIAgentWorkspaceProps {
  initialAgentId: string | null;
  userContext: AgentContext;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  recommendedTask?: {
    title: string;
    category: string;
    description: string;
  } | null;
}

function getInitialMessage(agentId: string, userName: string, targetRole: string): ChatMessage {
  const agent = getAgentById(agentId);
  return {
    id: "init",
    sender: "agent",
    text: `Hello ${userName.split(" ")[0]}! I am your **${agent.name}**. How can I help you prepare for your target role as a **${targetRole}** today?`,
  };
}

export function AIAgentWorkspace({ initialAgentId, userContext, onClose }: AIAgentWorkspaceProps) {
  const router = useRouter();
  const { push } = useToast();
  const [activeAgentId, setActiveAgentId] = useState(initialAgentId || "career-strategist");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    getInitialMessage(initialAgentId || "career-strategist", userContext.userName, userContext.targetRole),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingTaskId, setAddingTaskId] = useState<string | null>(null);
  const [addedTaskTitles, setAddedTaskTitles] = useState<Set<string>>(new Set());

  const activeAgent = getAgentById(activeAgentId);
  const chatEndRef = useRef<HTMLDivElement>(null);

  function handleSelectAgent(newAgentId: string) {
    if (newAgentId === activeAgentId) return;
    setActiveAgentId(newAgentId);
    setMessages([getInitialMessage(newAgentId, userContext.userName, userContext.targetRole)]);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSendMessage(promptText?: string) {
    const textToSend = promptText || input;
    if (!textToSend.trim() || loading) return;

    const userMsgId = `user-msg-${messages.length + 1}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: activeAgent.id,
          message: textToSend,
          context: userContext,
        }),
      });

      const json = await res.json();
      const agentMsgId = `agent-msg-${messages.length + 2}`;

      if (res.ok && json.success) {
        const agentMsg: ChatMessage = {
          id: agentMsgId,
          sender: "agent",
          text: json.data.reply,
          recommendedTask: json.data.recommendedTask,
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: agentMsgId,
            sender: "agent",
            text: "I experienced a connection issue while analyzing your request. Please try again.",
          },
        ]);
      }
    } catch {
      const agentErrId = `agent-err-${messages.length + 2}`;
      setMessages((prev) => [
        ...prev,
        {
          id: agentErrId,
          sender: "agent",
          text: "We couldn't reach the AI agent service. Please check your connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToRoadmap(task: { title: string; category: string; description: string }) {
    setAddingTaskId(task.title);
    try {
      const res = await fetch("/api/roadmap/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          category: task.category,
          description: task.description,
          week: 1,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setAddedTaskTitles((prev) => new Set(prev).add(task.title));
        push({
          title: "Added to Roadmap",
          description: `"${task.title}" has been added to your Job-Readiness Roadmap!`,
          tone: "success",
        });
        router.refresh();
      }
    } catch {
      push({ title: "Failed to Add Task", description: "Network error.", tone: "danger" });
    } finally {
      setAddingTaskId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Workspace Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold tracking-tight text-text">{activeAgent.name}</h3>
              <p className="text-xs font-medium text-text-secondary">{activeAgent.roleTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 overflow-x-auto max-w-md pr-2">
              {AI_AGENTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleSelectAgent(a.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    activeAgentId === a.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-text-secondary hover:text-text hover:bg-background"
                  }`}
                >
                  {a.name.split(" ")[0]}
                </button>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Workspace Content */}
        <div className="grid flex-1 overflow-hidden lg:grid-cols-3">
          {/* Left Panel: Agent Info & Prompts */}
          <div className="hidden lg:flex flex-col justify-between border-r border-border bg-muted/30 p-5 overflow-y-auto">
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Agent Mission</p>
                <p className="mt-1.5 text-xs text-text leading-relaxed">{activeAgent.purpose}</p>
              </div>

              <div className="rounded-xl bg-surface p-3.5 border border-border text-xs">
                <span className="font-bold text-primary">Target Goal:</span>{" "}
                <span className="font-semibold text-text">{userContext.targetRole}</span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2.5">
                  Suggested Prompts
                </p>
                <div className="space-y-2">
                  {activeAgent.suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="w-full rounded-xl border border-border bg-surface p-3 text-left text-xs font-medium text-text transition-all hover:border-primary hover:bg-primary-soft/30"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel: Chat */}
          <div className="flex flex-col justify-between lg:col-span-2 bg-background p-4 sm:p-6 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-surface border border-border text-text rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {msg.recommendedTask ? (
                      <div className="mt-3 border-t border-white/20 pt-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary-soft mb-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>AI Recommended Action Task</span>
                        </div>
                        <p className="font-bold text-text text-xs">{msg.recommendedTask.title}</p>
                        <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                          {msg.recommendedTask.description}
                        </p>

                        <div className="mt-2.5">
                          {addedTaskTitles.has(msg.recommendedTask.title) ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Added to Roadmap
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              loading={addingTaskId === msg.recommendedTask.title}
                              onClick={() => handleAddToRoadmap(msg.recommendedTask!)}
                              className="text-xs border-primary text-primary hover:bg-primary-soft gap-1.5"
                            >
                              <PlusCircle className="h-3.5 w-3.5" /> Add to My Roadmap
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex items-center gap-2 text-xs text-text-secondary italic">
                  <Bot className="h-4 w-4 animate-bounce text-primary" />
                  <span className="font-medium">{activeAgent.name} is thinking…</span>
                </div>
              ) : null}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-4 flex items-center gap-2.5 border-t border-border pt-4"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${activeAgent.name} a question...`}
                className="flex-1 text-xs"
              />
              <Button type="submit" size="sm" loading={loading} disabled={!input.trim()} className="px-3">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
