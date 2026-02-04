"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { LessonCard, type LessonStatus } from "@/components/lessons/LessonCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lesson } from "@/types";

interface LessonWithStatus extends Lesson {
  status: LessonStatus;
}

export default function LessonsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [lessons, setLessons] = useState<LessonWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    async function fetchLessons() {
      const supabase = createClient();

      const [{ data: dbLessons }, { data: progress }] = await Promise.all([
        supabase.from("lessons").select("*").order("sort_order"),
        supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", user!.id),
      ]);

      if (!dbLessons) {
        setLoading(false);
        return;
      }

      const completedIds = new Set(progress?.map((p) => p.lesson_id) ?? []);

      const lessonsWithStatus: LessonWithStatus[] = dbLessons.map(
        (lesson, index) => {
          let status: LessonStatus;
          if (completedIds.has(lesson.id)) {
            status = "completed";
          } else if (
            index === 0 ||
            completedIds.has(dbLessons[index - 1].id)
          ) {
            status = "available";
          } else {
            status = "locked";
          }
          return { ...lesson, status };
        }
      );

      setLessons(lessonsWithStatus);
      setLoading(false);
    }

    fetchLessons();
  }, [user, authLoading]);

  const handleCardClick = useCallback(
    (slug: string) => {
      router.push(`/lessons/${slug}`);
    },
    [router]
  );

  if (authLoading || loading) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6 fade-in">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-4 w-20 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold">Aulas Interativas</h1>
        <p className="mt-1 text-muted-foreground">
          Cada aula traz um truque pra facilitar as contas de cabeça
        </p>
      </div>

      <div className="grid gap-3">
        {lessons.map((lesson, index) => (
          <div key={lesson.slug} className="fade-in" style={{ animationDelay: `${index * 80}ms` }}>
            <LessonCard
              lesson={lesson}
              status={lesson.status}
              onClick={() => handleCardClick(lesson.slug)}
            />
          </div>
        ))}
      </div>

      {lessons.length === 0 && !loading && (
        <p className="text-center text-muted-foreground py-8">
          Nenhuma aula disponível no momento.
        </p>
      )}
    </main>
  );
}
