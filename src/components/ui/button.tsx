"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
  secondary: "bg-primary-soft text-primary hover:bg-primary-soft/70",
  outline: "border border-border bg-surface text-text hover:bg-background",
  ghost: "text-text hover:bg-background",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : { scale: 1.01 }}
        whileTap={disabled || loading ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.12 }}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...(props as HTMLMotionProps<"button">)}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
        ) : null}
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
