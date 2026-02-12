export interface LessonCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  sortRange: [number, number];
}

export const LESSON_CATEGORIES: LessonCategory[] = [
  {
    slug: "basicas",
    title: "Aulas Basicas",
    description: "Domine as 4 operacoes com tecnicas que aceleram seu calculo mental.",
    icon: "🧮",
    sortRange: [1, 99],
  },
  {
    slug: "dia-a-dia",
    title: "Matematica do Dia a Dia",
    description: "Porcentagens, fracoes e regra de 3 explicadas de um jeito que faz sentido.",
    icon: "🛒",
    sortRange: [100, 199],
  },
  {
    slug: "vestibulares",
    title: "Calculo Mental para Vestibulares",
    description: "Tecnicas avancadas para resolver questoes de provas mais rapido.",
    icon: "🎯",
    sortRange: [200, 299],
  },
];

/**
 * Returns the category for a lesson based on its `category` field,
 * with fallback to sort_order ranges.
 */
export function getLessonCategory(
  lesson: { category?: string; sort_order: number }
): LessonCategory | undefined {
  if (lesson.category) {
    return LESSON_CATEGORIES.find((c) => c.slug === lesson.category);
  }
  return LESSON_CATEGORIES.find(
    (c) => lesson.sort_order >= c.sortRange[0] && lesson.sort_order <= c.sortRange[1]
  );
}
