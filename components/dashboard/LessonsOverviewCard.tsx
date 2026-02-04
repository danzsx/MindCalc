import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

interface LessonsOverviewCardProps {
  completedCount: number;
  totalCount: number;
}

export function LessonsOverviewCard({
  completedCount,
  totalCount,
}: LessonsOverviewCardProps) {
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Aulas Interativas</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-5">
        Truques pra pensar mais rápido com números
      </p>

      <div className="space-y-2 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium text-foreground">
            {completedCount} de {totalCount} aulas
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-primary/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <Link
        href="/lessons"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-[#14B8A6] transition-colors"
      >
        Explorar aulas
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
