import { motion } from 'motion/react';
import { LayoutDashboard, BookOpen, Grid3x3, Dumbbell, Rocket, Moon, Sun, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface NavigationBarProps {
  currentPage?: 'painel' | 'aulas' | 'tabuada' | 'treinar' | 'planos';
  onNavigate?: (page: string) => void;
}

export function NavigationBar({ currentPage = 'painel', onNavigate }: NavigationBarProps) {
  const [darkMode, setDarkMode] = useState(true);

  const navItems = [
    { id: 'painel', label: 'Painel', icon: LayoutDashboard },
    { id: 'aulas', label: 'Aulas', icon: BookOpen },
    { id: 'tabuada', label: 'Tabuada', icon: Grid3x3 },
    { id: 'treinar', label: 'Treinar', icon: Dumbbell },
    { id: 'planos', label: 'Planos', icon: Rocket },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-2.5 rounded-2xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                MindCalc
              </h1>
              <span className="text-xs text-teal-400 font-medium">Admin</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="hidden md:block bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95">
              Assinar Pro
            </button>
            <div className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                F
              </div>
              <span className="text-sm text-white/80 max-w-[150px] truncate">federicoalcatrez@gmail...</span>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
