"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: { icon: "h-10 w-10", container: "py-10", title: "text-lg", desc: "text-sm" },
  md: { icon: "h-14 w-14", container: "py-16", title: "text-xl", desc: "text-sm" },
  lg: { icon: "h-20 w-20", container: "py-24", title: "text-2xl", desc: "text-base" },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  className,
  size = "md",
}: EmptyStateProps) {
  const cfg = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("text-center", cfg.container, className)}
    >
      <div className="inline-flex items-center justify-center mb-5">
        <div className={cn(
          "flex items-center justify-center rounded-2xl",
          "bg-muted/60 dark:bg-muted/30",
          cfg.icon
        )}>
          <Icon className="h-1/2 w-1/2 text-muted-foreground/50" />
        </div>
      </div>
      <h3 className={cn("font-semibold mb-1.5", cfg.title)}>{title}</h3>
      <p className={cn("text-muted-foreground max-w-sm mx-auto mb-6", cfg.desc)}>
        {description}
      </p>
      {actionLabel && (actionHref || actionOnClick) && (
        actionHref ? (
          <a href={actionHref}>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              {actionLabel}
            </Button>
          </a>
        ) : (
          <Button
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={actionOnClick}
          >
            {actionLabel}
          </Button>
        )
      )}
    </motion.div>
  );
}