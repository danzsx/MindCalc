import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface VisualExampleProps {
  children: ReactNode;
  caption?: string;
}

export function VisualExample({ children, caption }: VisualExampleProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
      <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          className="mb-6"
        >
          {children}
        </motion.div>

        {caption && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 text-lg text-center mt-4"
          >
            {caption}
          </motion.p>
        )}
      </div>
    </div>
  );
}
