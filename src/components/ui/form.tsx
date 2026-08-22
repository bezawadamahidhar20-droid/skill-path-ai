"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  required,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-text">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-text-secondary">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "h-11 w-full rounded-xl border bg-background px-4 text-sm text-text placeholder:text-text-secondary/60 transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10",
        invalid ? "border-danger" : "border-border",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-text-secondary/60 transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export function SliderField({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text">{label}</span>
        <span className="rounded-lg bg-primary-soft px-2.5 py-0.5 text-sm font-bold tabular-nums text-primary">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
        aria-label={label}
      />
    </div>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border px-3.5 py-2.5 text-sm transition-all duration-150 has-[:checked]:border-primary has-[:checked]:bg-primary-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        suppressHydrationWarning
        className="h-4 w-4 rounded accent-primary"
      />
      {label}
    </label>
  );
}

const CONFIDENCE_LEVELS = [
  { label: "Below Average", value: 25, color: "danger", description: "Significant gaps exist. Focused practice and structured learning needed." },
  { label: "Average", value: 50, color: "warning", description: "Basic understanding is there, but needs consistent effort to strengthen weak areas." },
  { label: "Good", value: 75, color: "primary", description: "Solid foundation with minor gaps. Targeted prep can make you interview-ready." },
  { label: "Perfect", value: 100, color: "success", description: "Strong mastery. Focus on advanced topics and real-world application." },
] as const;

export function ConfidenceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const selectedLevel = CONFIDENCE_LEVELS.find((l) => l.value === value);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-text">{label}</span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CONFIDENCE_LEVELS.map((level) => {
          const isSelected = value === level.value;
          return (
            <button
              key={level.value}
              type="button"
              title={level.description}
              onClick={() => onChange(level.value)}
              className={`rounded-xl border px-3 py-2.5 text-center text-xs font-bold transition-all duration-150 ${
                isSelected
                  ? level.color === "danger"
                    ? "border-danger bg-danger/10 text-danger shadow-sm"
                    : level.color === "warning"
                      ? "border-warning bg-warning/10 text-warning shadow-sm"
                      : level.color === "primary"
                        ? "border-primary bg-primary-soft text-primary shadow-sm"
                        : "border-success bg-success/10 text-success shadow-sm"
                  : "border-border bg-surface text-text-secondary hover:border-primary/30 hover:bg-muted"
              }`}
            >
              {level.label}
            </button>
          );
        })}
      </div>
      {selectedLevel ? (
        <p className="text-[11px] leading-relaxed text-text-secondary">
          {selectedLevel.description}
        </p>
      ) : null}
    </div>
  );
}
