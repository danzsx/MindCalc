"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { getLessonBySlug, allLessons } from "@/lib/lessons";
import { LessonShell } from "@/components/lessons/LessonShell";

export default function LessonPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const lesson = getLessonBySlug(slug);

  // Determine next lesson slug for navigation
  const lessonIdx = allLessons.findIndex((l) => l.slug === slug);
  const nextLessonSlug = lessonIdx >= 0 && lessonIdx < allLessons.length - 1
    ? allLessons[lessonIdx + 1].slug
    : undefined;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!lesson) {
      router.replace("/lessons");
      return;
    }

    async function checkAccess() {
      // Admin bypasses all lesson locks
      if (isAdmin) {
        setAllowed(true);
        setLoading(false);
        return;
      }

      const lessonIdx = allLessons.findIndex((l) => l.slug === slug);

      // First lesson is always accessible
      if (lessonIdx === 0) {
        setAllowed(true);
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const [{ data: dbLessons }, { data: progress }] = await Promise.all([
        supabase.from("lessons").select("id, slug").order("sort_order"),
        supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", user!.id),
      ]);

      if (!dbLessons) {
        router.replace("/lessons");
        return;
      }

      const completedIds = new Set(progress?.map((p) => p.lesson_id) ?? []);

      // Check if the previous lesson in sequence is completed
      const prevSlug = allLessons[lessonIdx - 1].slug;
      const prevDbLesson = dbLessons.find((l) => l.slug === prevSlug);

      if (prevDbLesson && completedIds.has(prevDbLesson.id)) {
        setAllowed(true);
        setLoading(false);
      } else {
        // Lesson is locked — redirect to list
        router.replace("/lessons");
      }
    }

    checkAccess();
  }, [slug, lesson, user, authLoading, isAdmin, router]);

  const handleComplete = useCallback(async () => {
    if (!user) return;

    await fetch("/api/lessons/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, lessonSlug: slug }),
    });
  }, [user, slug]);

  if (authLoading || loading || !allowed || !lesson) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <LessonShell lesson={lesson} onComplete={handleComplete} nextLessonSlug={nextLessonSlug} />
    </main>
  );
}
