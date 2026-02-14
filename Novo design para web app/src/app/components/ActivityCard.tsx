import { motion } from 'motion/react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface ActivityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stats?: { label: string; value: string };
  gradient: string;
  buttonText: string;
  delay?: number;
}

export function ActivityCard({ 
  icon: Icon, 
  title, 
  description, 
  stats, 
  gradient, 
  buttonText, 
  delay = 0 
}: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group"
    >
      <div className={`absolute inset-0 ${gradient} rounded-3xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-300`}></div>
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className={`inline-flex p-2.5 rounded-xl ${gradient}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {title}
          </h3>
        </div>
        
        {stats && (
          <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="text-sm text-white/60 mb-1">{stats.label}</div>
            <div className="text-lg font-semibold">{stats.value}</div>
          </div>
        )}
        
        <p className="text-white/70 text-sm mb-4">{description}</p>
        
        <button className={`w-full ${gradient} rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200`}>
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
