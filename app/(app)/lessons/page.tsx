"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { LessonCard, type LessonStatus } from "@/components/lessons/LessonCard";
import { Skeleton } from "@/components/ui/skeleton";
import { LESSON_CATEGORIES, getLessonCategory } from "@/lib/lessons/categories";
import { Plus, Minus, X, Divide, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import type { Lesson } from "@/types";

interface LessonWithStatus extends Lesson {
  status: LessonStatus;
}

interface CategoryGroup {
  slug: string;
  title: string;
  description: string;
  icon: string;
  lessons: LessonWithStatus[];
  completedCount: number;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  basicas: "from-emerald-500 to-teal-500",
  "dia-a-dia": "from-orange-500 to-amber-500",
  vestibulares: "from-blue-500 to-purple-500",
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  basicas: Plus,
  "dia-a-dia": Minus,
  vestibulares: X,
};

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

      // Group lessons by category for per-category unlock logic
      const categoryLessonsMap = new Map<string, typeof dbLessons>();
      for (const lesson of dbLessons) {
        const cat = getLessonCategory(lesson);
        const slug = cat?.slug ?? "basicas";
        if (!categoryLessonsMap.has(slug)) {
          categoryLessonsMap.set(slug, []);
        }
        categoryLessonsMap.get(slug)!.push(lesson);
      }

      const lessonsWithStatus: LessonWithStatus[] = dbLessons.map((lesson) => {
        const cat = getLessonCategory(lesson);
        const slug = cat?.slug ?? "basicas";
        const categoryLessons = categoryLessonsMap.get(slug) ?? [];
        const indexInCategory = categoryLessons.indexOf(lesson);

        let status: LessonStatus;
        if (completedIds.has(lesson.id)) {
          status = "completed";
        } else if (
          isAdmin ||
          indexInCategory === 0 ||
          completedIds.has(categoryLessons[indexInCategory - 1]?.id)
        ) {
          status = "available";
        } else {
          status = "locked";
        }
        return { ...lesson, status };
      });

      setLessons(lessonsWithStatus);
      setLoading(false);
    }

    fetchLessons();
  }, [user, authLoading, isAdmin]);

  const handleCardClick = useCallback(
    (slug: string) => {
      router.push(`/lessons/${slug}`);
    },
    [router]
  );

  const categories: CategoryGroup[] = useMemo(() => {
    return LESSON_CATEGORIES.map((cat) => {
      const catLessons = lessons.filter((l) => {
        const lCat = getLessonCategory(l);
        return lCat?.slug === cat.slug;
      });
      return {
        slug: cat.slug,
        title: cat.title,
        description: cat.description,
        icon: cat.icon,
        lessons: catLessons,
        completedCount: catLessons.filter((l) => l.status === "completed").length,
      };
    }).filter((g) => g.lessons.length > 0);
  }, [lessons]);

  const totalCompleted = useMemo(
    () => lessons.filter((l) => l.status === "completed").length,
    [lessons]
  );

  if (authLoading || loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 space-y-8">
        {/* Skeleton hero */}
        <div>
          <Skeleton className="h-4 w-40 mb-6 bg-white/5 rounded-full" />
          <Skeleton className="h-14 w-96 mb-4 bg-white/5 rounded-2xl" />
          <Skeleton className="h-6 w-72 bg-white/5 rounded-xl" />
        </div>
        {/* Skeleton progress card */}
        <Skeleton className="h-36 w-full bg-white/5 rounded-3xl" />
        {/* Skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 bg-white/5 rounded-3xl" />
          ))}
        </div>
      </main>
    );
  }

  const progressPercent = lessons.length > 0 ? (totalCompleted / lessons.length) * 100 : 0;

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 pb-36 md:pb-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-sm text-teal-300 font-medium">
            {lessons.length} aulas disponíveis
          </span>
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent leading-tight"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Sua Jornada de{"\n"}Aprendizado
        </h1>
        <p className="text-xl text-white/60 max-w-2xl">
          Cada aula te deixa mais rapido e confiante no calculo mental. Continue evoluindo!
        </p>
      </motion.div>

      {/* Overall Progress Card */}
      {lessons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-16 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2
                  className="text-2xl font-bold mb-1 text-white"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Progresso Geral
                </h2>
                <p className="text-white/60">Continue assim para desbloquear novas tecnicas!</p>
              </div>
              <div className="text-right">
                <div
                  className="text-5xl font-bold text-teal-400 mb-1"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  {Math.round(progressPercent)}%
                </div>
                <p className="text-sm text-white/50">
                  {totalCompleted} de {lessons.length} concluidas
                </p>
              </div>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Sections */}
      {categories.map((cat, catIdx) => {
        const catProgress = cat.lessons.length > 0
          ? (cat.completedCount / cat.lessons.length) * 100
          : 0;
        const CatIcon = CATEGORY_ICONS[cat.slug] ?? Plus;
        const catGradient = CATEGORY_GRADIENTS[cat.slug] ?? "from-teal-500 to-cyan-500";

        return (
          <motion.section
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + catIdx * 0.1, duration: 0.5 }}
            className="mb-12"
          >
            {/* Category Header Card */}
            <div className="relative group mb-6">
              <div className={`absolute inset-0 bg-gradient-to-r ${catGradient} rounded-3xl opacity-10 blur-xl`} />
              <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${catGradient} p-3 rounded-2xl flex-shrink-0`}>
                    <span className="text-2xl">{cat.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h2
                      className="text-2xl font-bold mb-1 text-white"
                      style={{ fontFamily: "var(--font-family-display)" }}
                    >
                      {cat.title}
                    </h2>
                    <p className="text-white/60 text-sm mb-4">{cat.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50">
                        {cat.completedCount} de {cat.lessons.length}
                      </span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-xs">
                        <div
                          className={`h-full bg-gradient-to-r ${catGradient} rounded-full transition-all duration-500`}
                          style={{ width: `${catProgress}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-teal-400">
                        {Math.round(catProgress)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.lessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.slug}
                  lesson={lesson}
                  status={lesson.status}
                  index={index}
                  total={cat.lessons.length}
                  onClick={() => handleCardClick(lesson.slug)}
                />
              ))}
            </div>
          </motion.section>
        );
      })}

      {lessons.length === 0 && !loading && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-5 blur-2xl" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <p className="text-white/60 text-lg">
              Nenhuma aula disponivel no momento.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
