import { motion } from 'motion/react';
import { Info, ArrowRight, RotateCcw } from 'lucide-react';
import { ReactNode } from 'react';

interface LessonContentProps {
  title: string;
  tip?: string;
  children: ReactNode;
  onNext?: () => void;
  onRetry?: () => void;
  buttonText?: string;
  showTip?: boolean;
}

export function LessonContent({
  title,
  tip,
  children,
  onNext,
  onRetry,
  buttonText = 'Bora aprender!',
  showTip = true,
}: LessonContentProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-8"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {title}
      </motion.h1>

      {/* Tip Card */}
      {showTip && tip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-2.5 rounded-xl flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/90 leading-relaxed">{tip}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        {children}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4"
      >
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tentar novamente</span>
          </button>
        )}
        
        {onNext && (
          <button
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 group/btn"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}
      </motion.div>
    </div>
  );
}
