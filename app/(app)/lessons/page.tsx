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

/* Numetria operation color remapping */
const CATEGORY_COLORS: Record<string, { icon: string; bar: string; badge: string; glow: string }> = {
  basicas: {
    icon: "bg-[rgba(55,112,191,0.15)] border border-[rgba(55,112,191,0.3)] text-[#8dc2ff]",
    bar: "from-[#3770bf] to-[#8dc2ff]",
    badge: "bg-[rgba(55,112,191,0.12)] border-[rgba(55,112,191,0.25)] text-[#8dc2ff]",
    glow: "rgba(55,112,191,0.15)",
  },
  "dia-a-dia": {
    icon: "bg-[rgba(206,242,109,0.1)] border border-[rgba(206,242,109,0.2)] text-[#cef26d]",
    bar: "from-[#cef26d] to-[#a8cc47]",
    badge: "bg-[rgba(206,242,109,0.08)] border-[rgba(206,242,109,0.2)] text-[#cef26d]",
    glow: "rgba(206,242,109,0.1)",
  },
  vestibulares: {
    icon: "bg-[rgba(141,194,255,0.1)] border border-[rgba(141,194,255,0.2)] text-[#8dc2ff]",
    bar: "from-[#8dc2ff] to-[#3770bf]",
    badge: "bg-[rgba(141,194,255,0.08)] border-[rgba(141,194,255,0.2)] text-[#8dc2ff]",
    glow: "rgba(141,194,255,0.1)",
  },
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
        <div>
          <Skeleton className="h-5 w-40 mb-6 rounded-full" style={{ background: "rgba(141,194,255,0.08)" }} />
          <Skeleton className="h-12 w-80 mb-3 rounded-2xl" style={{ background: "rgba(141,194,255,0.06)" }} />
          <Skeleton className="h-5 w-64 rounded-xl" style={{ background: "rgba(141,194,255,0.05)" }} />
        </div>
        <Skeleton className="h-32 w-full rounded-[2rem]" style={{ background: "rgba(13,29,58,0.6)" }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-[2rem]" style={{ background: "rgba(13,29,58,0.6)" }} />
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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-12"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border"
          style={{
            background: "rgba(55,112,191,0.1)",
            borderColor: "rgba(55,112,191,0.25)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#8dc2ff] animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#8dc2ff]">
            {lessons.length} aulas disponíveis
          </span>
        </div>

        <h1
          className="text-5xl md:text-6xl font-bold mb-4 text-[#f0f4ff] tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Sua Jornada de<br />Aprendizado
        </h1>
        <p className="text-lg text-[#6b89b4] max-w-xl leading-relaxed">
          Cada aula te deixa mais rápido e confiante no cálculo mental.
        </p>
      </motion.div>

      {/* Overall Progress Card */}
      {lessons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="mb-14"
        >
          <div
            className="rounded-[2rem] p-7 md:p-9 relative overflow-hidden border"
            style={{
              background: "rgba(13,29,58,0.65)",
              borderColor: "rgba(141,194,255,0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {/* Radial glow */}
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle at 80% 20%, rgba(206,242,109,0.06) 0%, transparent 70%)",
              }}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6 relative z-10">
              <div>
                <h2
                  className="text-2xl md:text-3xl font-bold mb-1 text-[#f0f4ff]"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Progresso Geral
                </h2>
                <p className="text-[#6b89b4] text-sm font-medium">
                  Continue assim para desbloquear novas técnicas!
                </p>
              </div>
              <div className="text-right shrink-0">
                <div
                  className="text-5xl font-bold text-[#cef26d] mb-0.5"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  {Math.round(progressPercent)}%
                </div>
                <p className="text-xs font-semibold text-[#6b89b4] uppercase tracking-widest">
                  {totalCompleted} de {lessons.length} concluídas
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="h-2.5 rounded-full overflow-hidden relative z-10"
              style={{ background: "rgba(141,194,255,0.08)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full relative overflow-hidden"
                style={{ background: "linear-gradient(90deg, #3770bf 0%, #cef26d 100%)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
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
        const colors = CATEGORY_COLORS[cat.slug] ?? CATEGORY_COLORS.basicas;

        return (
          <motion.section
            key={cat.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + catIdx * 0.1, duration: 0.5 }}
            className="mb-16"
          >
            {/* Category Header */}
            <div className="mb-8 flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl shrink-0 ${colors.icon}`}>
                <CatIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2
                  className="text-2xl md:text-3xl font-bold mb-1 text-[#f0f4ff]"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  {cat.title}
                </h2>
                <p className="text-[#6b89b4] text-sm mb-4 leading-relaxed max-w-lg">
                  {cat.description}
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <span className="text-xs font-semibold text-[#6b89b4] tabular-nums min-w-[40px]">
                    {cat.completedCount}/{cat.lessons.length}
                  </span>
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(141,194,255,0.08)" }}
                  >
                    <div
                      className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-700`}
                      style={{ width: `${catProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#a8c0e0] min-w-[32px] text-right">
                    {Math.round(catProgress)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Lesson Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div
          className="rounded-[2rem] p-12 text-center border"
          style={{
            background: "rgba(13,29,58,0.6)",
            borderColor: "rgba(141,194,255,0.1)",
          }}
        >
          <p className="text-[#6b89b4] text-base font-medium">
            Nenhuma aula disponível no momento.
          </p>
        </div>
      )}
    </main>
  );
}
