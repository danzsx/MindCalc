import { motion } from 'motion/react';

interface PizzaVisualProps {
  slices?: number;
  highlightedSlices?: number[];
}

export function PizzaVisual({ slices = 8, highlightedSlices = [] }: PizzaVisualProps) {
  const anglePerSlice = 360 / slices;

  return (
    <div className="relative w-64 h-64">
      {/* Pizza Shadow */}
      <div className="absolute inset-0 bg-orange-900/30 rounded-full blur-2xl transform translate-y-4"></div>
      
      {/* Pizza Base */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-2xl"
      >
        {/* Crust */}
        <div className="absolute inset-0 rounded-full border-8 border-orange-300"></div>
        
        {/* Cheese texture */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400"></div>

        {/* Pepperoni */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60) + 30;
          const radius = 70;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
              className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-900"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              {/* Pepperoni spots */}
              <div className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-red-900/50"></div>
              <div className="absolute bottom-2 right-1 w-1 h-1 rounded-full bg-red-900/50"></div>
            </motion.div>
          );
        })}

        {/* Slice lines */}
        {[...Array(slices)].map((_, i) => {
          const angle = i * anglePerSlice;
          const isHighlighted = highlightedSlices.includes(i);

          return (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className="absolute top-1/2 left-1/2 origin-left h-0.5 bg-orange-800/50"
              style={{
                width: '50%',
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        })}
      </motion.div>

      {/* Glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-[-20px] bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl -z-10"
      ></motion.div>
    </div>
  );
}
