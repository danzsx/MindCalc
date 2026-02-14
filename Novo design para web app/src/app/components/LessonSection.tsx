import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface LessonSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  completed: number;
  total: number;
  gradient: string;
  delay?: number;
  children: React.ReactNode;
}

export function LessonSection({ 
  icon: Icon, 
  title, 
  description, 
  completed, 
  total, 
  gradient,
  delay = 0,
  children 
}: LessonSectionProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="mb-8"
    >
      <div className="relative group mb-6">
        <div className={`absolute inset-0 ${gradient} rounded-3xl opacity-10 blur-xl`}></div>
        <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className={`${gradient} p-3 rounded-2xl flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {title}
                </h2>
                <p className="text-white/60 text-sm mb-4">{description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/50">{completed} de {total}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-xs">
                    <div 
                      className={`h-full ${gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-teal-400">{percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
}
