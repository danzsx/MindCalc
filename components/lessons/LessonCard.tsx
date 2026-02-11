"use client";

import { cn } from "@/lib/utils";
import { getOperatorSymbol } from "@/lib/lessons/utils";
import { CheckCircle2, Lock, Plus, Minus, X, Divide } from "lucide-react";
import { Button } from "@/components/ui/button";

export type LessonStatus = "completed" | "available" | "locked";

const OPERATOR_ICONS: Record<string, typeof Plus> = {
  "+": Plus,
  "-": Minus,
  "*": X,
  "/": Divide,
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
  index: number;
  total: number;
  onClick: () => void;
}

export function LessonCard({ lesson, status, index, total, onClick }: LessonCardProps) {
  const OperatorIcon = OPERATOR_ICONS[lesson.operator] ?? Plus;
  const isClickable = status !== "locked";
  const symbol = getOperatorSymbol(lesson.operator);

  return (
    <div className="flex gap-4 items-start">
      {/* Trail node */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={cn(
            "flex items-center justify-center rounded-full border-2 transition-all duration-300",
            "w-12 h-12",
            status === "completed" && "bg-success border-success text-success-foreground",
            status === "available" && "border-primary bg-primary/10 text-primary lesson-pulse",
            status === "locked" && "border-muted bg-muted/50 text-muted-foreground opacity-50"
          )}
        >
          {status === "completed" ? (
            <CheckCircle2 className="size-5" />
          ) : status === "locked" ? (
            <Lock className="size-4" />
          ) : (
            <OperatorIcon className="size-5" />
          )}
        </div>
      </div>

      {/* Card content */}
      <div
        className={cn(
          "flex-1 rounded-xl border p-4 transition-all duration-300",
          isClickable
            ? "cursor-pointer bg-card hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
            : "opacity-50 cursor-not-allowed bg-muted/30",
          status === "completed" && "border-success/20 bg-success/5"
        )}
        onClick={isClickable ? onClick : undefined}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-caption text-muted-foreground">
                Aula {index + 1} de {total}
              </span>
              {status === "completed" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-caption-medium bg-success/10 text-success border border-success/20">
                  Concluida
                </span>
              )}
            </div>
            <p className="text-body-emphasis truncate">{lesson.title}</p>
            <p className="text-body-primary text-muted-foreground truncate">
              {lesson.description}
            </p>
          </div>

          {status === "available" && (
            <Button size="sm" className="shrink-0">
              Comecar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
