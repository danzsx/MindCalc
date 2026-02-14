import { motion } from 'motion/react';

interface ProgressSectionProps {
  completed: number;
  total: number;
  delay?: number;
}

export function ProgressSection({ completed, total, delay = 0 }: ProgressSectionProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-end justify-between mb-3">
        <span className="text-sm text-white/60">
          {completed} de {total} aulas concluídas
        </span>
        <span className="text-2xl font-bold text-teal-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {percentage}%
        </span>
      </div>
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
        />
      </div>
    </motion.div>
  );
}
