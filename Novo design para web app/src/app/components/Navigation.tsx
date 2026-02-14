import { motion } from 'motion/react';
import { Home, BookOpen, Sparkles, User, Bell, Grid3x3, Dumbbell, CreditCard } from 'lucide-react';

interface NavigationProps {
  currentPage: 'painel' | 'aulas' | 'tabuada' | 'treinar' | 'planos';
  onNavigate: (page: 'painel' | 'aulas' | 'tabuada' | 'treinar' | 'planos') => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex items-center justify-between mb-12"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-2xl">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              MindCalc
            </h1>
            <p className="text-sm text-white/50">Sua mente turbinada</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('painel')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              currentPage === 'painel'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Painel</span>
          </button>
          <button
            onClick={() => onNavigate('aulas')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              currentPage === 'aulas'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Aulas</span>
          </button>
          <button
            onClick={() => onNavigate('tabuada')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              currentPage === 'tabuada'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            <span>Tabuada</span>
          </button>
          <button
            onClick={() => onNavigate('treinar')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              currentPage === 'treinar'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Treinar</span>
          </button>
          <button
            onClick={() => onNavigate('planos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              currentPage === 'planos'
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Planos</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-teal-400 rounded-full"></span>
          </button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center font-bold">
              F
            </div>
            <span className="text-sm">Federico</span>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-20 blur-xl"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-2 flex items-center justify-around">
            <button
              onClick={() => onNavigate('painel')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                currentPage === 'painel'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  : 'text-white/60'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Painel</span>
            </button>
            <button
              onClick={() => onNavigate('aulas')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                currentPage === 'aulas'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  : 'text-white/60'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Aulas</span>
            </button>
            <button
              onClick={() => onNavigate('tabuada')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                currentPage === 'tabuada'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  : 'text-white/60'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
              <span className="text-xs">Tabuada</span>
            </button>
            <button
              onClick={() => onNavigate('treinar')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                currentPage === 'treinar'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  : 'text-white/60'
              }`}
            >
              <Dumbbell className="w-5 h-5" />
              <span className="text-xs">Treinar</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}