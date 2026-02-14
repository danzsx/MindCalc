import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  gradient: string;
  delay?: number;
}

export function StatsCard({ icon: Icon, value, label, gradient, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className={`absolute inset-0 ${gradient} rounded-3xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-300`}></div>
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
        <div className={`inline-flex p-3 rounded-2xl ${gradient} mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {value}
        </div>
        <div className="text-sm text-white/70">{label}</div>
      </div>
    </motion.div>
  );
}
