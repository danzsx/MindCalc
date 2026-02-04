"use client";

import { Button } from "@/components/ui/button";
import { PartyPopper, Dumbbell, LayoutDashboard } from "lucide-react";

interface LessonCompletionProps {
  technique: string;
  onPracticeMore: () => void;
  onDashboard: () => void;
}

export function LessonCompletion({
  technique,
  onPracticeMore,
  onDashboard,
}: LessonCompletionProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <PartyPopper className="size-8 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Esse truque já é seu!</h2>
        <p className="text-muted-foreground leading-relaxed">
          Você pegou a técnica <span className="font-medium text-foreground">&ldquo;{technique}&rdquo;</span>. Agora é só deixar ficar automático.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button onClick={onPracticeMore} size="lg" className="w-full">
          <Dumbbell className="size-4" />
          Quero praticar mais
        </Button>
        <Button onClick={onDashboard} variant="outline" size="lg" className="w-full">
          <LayoutDashboard className="size-4" />
          Voltar ao painel
        </Button>
      </div>
    </div>
  );
}
