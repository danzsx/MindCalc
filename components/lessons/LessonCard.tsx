"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, PlayCircle, Lock, Plus, Minus, X, Divide } from "lucide-react";

export type LessonStatus = "completed" | "available" | "locked";

const OPERATOR_ICONS: Record<string, typeof Plus> = {
  "+": Plus,
  "-": Minus,
  "*": X,
  "/": Divide,
};

const STATUS_CONFIG: Record<
  LessonStatus,
  { icon: typeof CheckCircle2; label: string; color: string }
> = {
  completed: {
    icon: CheckCircle2,
    label: "Concluída",
    color: "text-green-600 dark:text-green-400",
  },
  available: {
    icon: PlayCircle,
    label: "Disponível",
    color: "text-primary",
  },
  locked: {
    icon: Lock,
    label: "Bloqueada",
    color: "text-muted-foreground",
  },
};

interface LessonCardProps {
  lesson: {
    slug: string;
    title: string;
    description: string;
    operator: string;
    sort_order: number;
    difficulty: string;
  };
  status: LessonStatus;
  onClick: () => void;
}

export function LessonCard({ lesson, status, onClick }: LessonCardProps) {
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;
  const OperatorIcon = OPERATOR_ICONS[lesson.operator] ?? Plus;
  const isClickable = status !== "locked";

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isClickable
          ? "cursor-pointer hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)] hover:border-primary/30 hover:-translate-y-1"
          : "opacity-60 cursor-not-allowed"
      )}
      onClick={isClickable ? onClick : undefined}
    >
      <CardContent className="flex items-center gap-4 pt-6">
        {/* Operator icon */}
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            status === "locked" ? "bg-muted" : "bg-primary/10"
          )}
        >
          <OperatorIcon
            className={cn(
              "size-5",
              status === "locked" ? "text-muted-foreground" : "text-primary"
            )}
          />
        </div>

        {/* Title and description */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{lesson.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {lesson.description}
          </p>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusIcon className={cn("size-4", config.color)} />
          <span className={cn("text-xs font-medium hidden sm:inline", config.color)}>
            {config.label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
