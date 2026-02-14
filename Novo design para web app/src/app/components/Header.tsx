import { motion } from 'motion/react';
import { Sparkles, User } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-8"
    >
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-2xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            MindCalc
          </h1>
          <p className="text-xs text-white/60">Treine seu cérebro</p>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 p-3 rounded-2xl hover:bg-white/15 transition-colors"
      >
        <User className="w-5 h-5" />
      </motion.button>
    </motion.header>
  );
}
