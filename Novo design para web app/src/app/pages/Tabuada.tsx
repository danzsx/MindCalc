import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, X, Divide, BookOpen, Zap } from 'lucide-react';
import { Navigation } from '../components/Navigation';

interface TabuadaProps {
  onNavigate: (page: 'painel' | 'aulas' | 'tabuada' | 'treinar' | 'planos') => void;
}

export function Tabuada({ onNavigate }: TabuadaProps) {
  const [selectedOperation, setSelectedOperation] = useState<'+' | '-' | '×' | '÷'>('+');
  const [selectedRange, setSelectedRange] = useState<'1-5' | '1-10' | '1-12'>('1-5');
  const [selectedMode, setSelectedMode] = useState<'guided' | 'free'>('guided');

  const operations = [
    { id: '+', icon: Plus, label: 'Adição', color: 'from-emerald-500 to-teal-500' },
    { id: '-', icon: Minus, label: 'Subtração', color: 'from-orange-500 to-red-500' },
    { id: '×', icon: X, label: 'Multiplicação', color: 'from-blue-500 to-purple-500' },
    { id: '÷', icon: Divide, label: 'Divisão', color: 'from-yellow-500 to-orange-500' },
  ] as const;

  const ranges = [
    { id: '1-5', label: '1 a 5' },
    { id: '1-10', label: '1 a 10' },
    { id: '1-12', label: '1 a 12' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white p-6 md:p-8 pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <Navigation currentPage="tabuada" onNavigate={onNavigate} />

        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Tabuada
            </h1>
            <p className="text-xl text-white/60">
              Pratique as operações no seu ritmo, sem pressa.
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10">
              
              {/* Operation Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Operação</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {operations.map((op) => {
                    const Icon = op.icon;
                    const isSelected = selectedOperation === op.id;
                    
                    return (
                      <motion.button
                        key={op.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedOperation(op.id)}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-teal-400 bg-white/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className={`bg-gradient-to-br ${op.color} p-3 rounded-xl mx-auto w-fit mb-2`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-medium">{op.id}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Range Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Intervalo</h3>
                <div className="grid grid-cols-3 gap-3">
                  {ranges.map((range) => {
                    const isSelected = selectedRange === range.id;
                    
                    return (
                      <motion.button
                        key={range.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRange(range.id)}
                        className={`p-4 rounded-xl border-2 font-semibold transition-all duration-300 ${
                          isSelected
                            ? 'border-teal-400 bg-white/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {range.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Mode Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Modo</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMode('guided')}
                    className={`w-full p-5 rounded-2xl border-2 flex items-start gap-4 transition-all duration-300 ${
                      selectedMode === 'guided'
                        ? 'border-teal-400 bg-white/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold mb-1">Guiado</div>
                      <div className="text-sm text-white/60">Sem tempo, com explicações</div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMode('free')}
                    className={`w-full p-5 rounded-2xl border-2 flex items-start gap-4 transition-all duration-300 ${
                      selectedMode === 'free'
                        ? 'border-teal-400 bg-white/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold mb-1">Treino livre</div>
                      <div className="text-sm text-white/60">Sequencial com feedback</div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30"
              >
                Bora começar
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
