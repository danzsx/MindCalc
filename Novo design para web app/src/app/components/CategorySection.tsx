import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface CategorySectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  completed: number;
  total: number;
  gradient: string;
  delay?: number;
  children: React.ReactNode;
}

export function CategorySection({
  icon: Icon,
  title,
  description,
  completed,
  total,
  gradient,
  delay = 0,
  children,
}: CategorySectionProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="mb-16"
    >
      {/* Category Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className={`${gradient} p-4 rounded-2xl`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {title}
            </h2>
            <p className="text-white/60 max-w-2xl">{description}</p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-4xl font-bold text-teal-400 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {percentage}%
          </span>
          <span className="text-sm text-white/50">
            {completed}/{total} concluídas
          </span>
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">{completed} de {total} aulas</span>
          <span className="text-2xl font-bold text-teal-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {percentage}%
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.3, duration: 1 }}
            className={`h-full ${gradient} rounded-full`}
          />
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </motion.section>
  );
}
