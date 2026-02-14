import { motion } from 'motion/react';
import { LucideIcon, Play, CheckCircle2, Lock } from 'lucide-react';

interface ModernLessonCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'completed' | 'available' | 'locked';
  gradient: string;
  delay?: number;
  onStart?: () => void;
}

export function ModernLessonCard({
  icon: Icon,
  title,
  description,
  duration,
  difficulty,
  status,
  gradient,
  delay = 0,
  onStart,
}: ModernLessonCardProps) {
  const difficultyColors = {
    easy: 'text-emerald-400 bg-emerald-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    hard: 'text-red-400 bg-red-400/10',
  };

  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: status === 'locked' ? 1 : 1.02, y: status === 'locked' ? 0 : -4 }}
      className={`relative group ${status === 'locked' ? 'opacity-60' : ''}`}
    >
      {/* Glow Effect */}
      {status !== 'locked' && (
        <div className={`absolute inset-0 ${gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`}></div>
      )}
      
      <div className={`relative bg-white/5 backdrop-blur-md border rounded-3xl overflow-hidden ${
        status === 'completed' ? 'border-teal-500/30' : 'border-white/10'
      }`}>
        {/* Icon Header */}
        <div className="relative h-32 flex items-center justify-center overflow-hidden">
          <div className={`absolute inset-0 ${gradient} opacity-10`}></div>
          <div className={`relative ${gradient} p-5 rounded-3xl shadow-2xl`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          
          {status === 'completed' && (
            <div className="absolute top-4 right-4 bg-teal-500 p-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          )}
          
          {status === 'locked' && (
            <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full backdrop-blur-sm">
              <Lock className="w-5 h-5 text-white/60" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${difficultyColors[difficulty]}`}>
              {difficultyLabels[difficulty]}
            </span>
            <span className="text-xs text-white/50">• {duration}</span>
          </div>

          <h3 className="text-xl font-bold mb-2 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {title}
          </h3>
          <p className="text-sm text-white/60 mb-4 line-clamp-2">
            {description}
          </p>

          <button
            disabled={status === 'locked'}
            onClick={onStart}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              status === 'locked'
                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                : status === 'completed'
                ? 'bg-white/10 hover:bg-white/15 text-white'
                : `${gradient} text-white hover:shadow-lg hover:shadow-teal-500/20`
            }`}
          >
            {status === 'locked' ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Bloqueada</span>
              </>
            ) : status === 'completed' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Revisar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Começar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}