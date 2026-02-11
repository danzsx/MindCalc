"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  const { user, loading: authLoading, isAdmin } = useAuth();
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
            isAdmin ||
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

  const basicLessons = useMemo(
    () => lessons.filter((l) => l.sort_order < 100),
    [lessons]
  );

  const bonusLessons = useMemo(
    () => lessons.filter((l) => l.sort_order >= 100),
    [lessons]
  );

  const completedCount = useMemo(
    () => lessons.filter((l) => l.status === "completed").length,
    [lessons]
  );

  if (authLoading || loading) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6 fade-in">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="h-12 w-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  const progressPercent = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <main className="container mx-auto max-w-3xl px-4 fade-in" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header with integrated progress */}
      <div>
        <h1 className="text-page-title text-foreground">Sua Jornada</h1>
        <p className="text-body-primary text-muted-foreground" style={{ marginTop: 'var(--space-xs)' }}>
          Cada passo te deixa mais rapido no calculo mental
        </p>
        {lessons.length > 0 && (
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption-medium text-muted-foreground">
                {completedCount} de {lessons.length} aulas concluidas
              </span>
              <span className="text-caption-medium text-primary">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Basic Lessons Trail */}
      {basicLessons.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-section-title text-foreground">
              Aulas Basicas
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="relative">
            {/* Vertical connector line */}
            <div
              className="absolute left-6 top-6 bottom-6 w-0.5 bg-border -translate-x-1/2"
              aria-hidden="true"
            />

            <div className="space-y-4 relative">
              {basicLessons.map((lesson, index) => (
                <div
                  key={lesson.slug}
                  className="fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <LessonCard
                    lesson={lesson}
                    status={lesson.status}
                    index={index}
                    total={lessons.length}
                    onClick={() => handleCardClick(lesson.slug)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Checkpoint between basic and bonus */}
      {bonusLessons.length > 0 && basicLessons.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-secondary/30" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
            <span className="text-lg">🎁</span>
            <span className="text-caption-medium text-secondary-foreground">
              Conteudo Bonus
            </span>
          </div>
          <div className="h-px flex-1 bg-secondary/30" />
        </div>
      )}

      {/* Bonus Lessons Trail */}
      {bonusLessons.length > 0 && (
        <section>
          <div className="bg-secondary/5 rounded-xl border border-secondary/20 p-4 sm:p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">🎁</div>
              <div>
                <h3 className="text-card-title text-foreground" style={{ marginBottom: 'var(--space-xs)' }}>
                  Conteudo extra para o dia a dia
                </h3>
                <p className="text-body-primary text-muted-foreground" style={{ lineHeight: 'var(--leading-relaxed)' }}>
                  Porcentagens, fracoes e regra de 3 explicadas de um jeito que
                  faz sentido.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Vertical connector line */}
            <div
              className="absolute left-6 top-6 bottom-6 w-0.5 bg-border -translate-x-1/2"
              aria-hidden="true"
            />

            <div className="space-y-4 relative">
              {bonusLessons.map((lesson, index) => (
                <div
                  key={lesson.slug}
                  className="fade-in"
                  style={{
                    animationDelay: `${(basicLessons.length + index) * 80}ms`,
                  }}
                >
                  <LessonCard
                    lesson={lesson}
                    status={lesson.status}
                    index={basicLessons.length + index}
                    total={lessons.length}
                    onClick={() => handleCardClick(lesson.slug)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {lessons.length === 0 && !loading && (
        <p className="text-center text-muted-foreground py-8">
          Nenhuma aula disponivel no momento.
        </p>
      )}
    </main>
  );
}
