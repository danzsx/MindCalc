"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { LessonCard, type LessonStatus } from "@/components/lessons/LessonCard";
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
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Aulas Interativas</h1>
        <p className="mt-1 text-muted-foreground">
          Cada aula ensina uma técnica prática de cálculo mental
        </p>
      </div>

      <div className="grid gap-3">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.slug}
            lesson={lesson}
            status={lesson.status}
            onClick={() => handleCardClick(lesson.slug)}
          />
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
