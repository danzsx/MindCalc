import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface LessonsOverviewCardProps {
  completedCount: number;
  totalCount: number;
}

export function LessonsOverviewCard({
  completedCount,
  totalCount,
}: LessonsOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          Aulas Interativas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Aprenda técnicas para calcular mais rápido
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">
              {completedCount} de {totalCount} aulas
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/lessons">Ver Aulas</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
