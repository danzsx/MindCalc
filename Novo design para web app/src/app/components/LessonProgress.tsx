import { motion } from 'motion/react';
import { LucideIcon, BookOpen, Lightbulb, Eye, Target, CheckCircle2 } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface LessonProgressProps {
  currentStep: number;
  totalSteps: number;
}

const steps: Step[] = [
  { id: 'conceito', label: 'Conceito', icon: BookOpen },
  { id: 'guiado', label: 'Guiado', icon: Lightbulb },
  { id: 'pista', label: 'Pista', icon: Eye },
  { id: 'sozinho', label: 'Sozinho', icon: Target },
  { id: 'pronto', label: 'Pronto!', icon: CheckCircle2 },
];

export function LessonProgress({ currentStep, totalSteps }: LessonProgressProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Glow for current step */}
                  {isCurrent && (
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
                  )}
                  
                  <div
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-teal-500 to-cyan-500 border-2 border-teal-400'
                        : isCurrent
                        ? 'bg-gradient-to-br from-teal-500 to-cyan-500 border-2 border-teal-300 shadow-lg shadow-teal-500/50'
                        : 'bg-white/5 border-2 border-white/20'
                    }`}
                  >
                    <StepIcon
                      className={`w-6 h-6 transition-all duration-300 ${
                        isCompleted || isCurrent ? 'text-white' : 'text-white/40'
                      }`}
                    />
                  </div>
                </motion.div>

                {/* Label */}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={`text-sm mt-3 font-medium transition-colors duration-300 ${
                    isCompleted || isCurrent ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {step.label}
                </motion.span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 mt-[-28px] bg-white/10 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
