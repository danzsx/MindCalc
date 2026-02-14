import { motion } from 'motion/react';
import { LucideIcon, CheckCircle2 } from 'lucide-react';

interface LessonCardProps {
  icon: LucideIcon;
  lessonNumber: number;
  totalLessons: number;
  title: string;
  description: string;
  completed?: boolean;
  delay?: number;
  onStart?: () => void;
}

export function LessonCard({ 
  icon: Icon, 
  lessonNumber, 
  totalLessons,
  title, 
  description, 
  completed = false,
  delay = 0,
  onStart
}: LessonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className="flex items-start gap-4">
        {/* Icon Circle */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center ${
          completed 
            ? 'border-teal-400 bg-teal-400/20' 
            : 'border-teal-500/40 bg-white/5'
        }`}>
          <Icon className={`w-6 h-6 ${completed ? 'text-teal-400' : 'text-teal-300'}`} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="text-xs text-white/50 mb-1">
                  Aula {lessonNumber} de {totalLessons}
                  {completed && <span className="ml-2 text-teal-400">• Concluída</span>}
                </div>
                <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {title}
                </h3>
                <p className="text-sm text-white/60">{description}</p>
              </div>
              
              {completed ? (
                <div className="flex items-center gap-1 text-teal-400 text-sm font-medium bg-teal-400/10 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Concluída</span>
                </div>
              ) : (
                <button
                  onClick={onStart}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Começar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
