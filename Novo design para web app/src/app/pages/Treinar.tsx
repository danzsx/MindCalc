import { useState } from 'react';
import { motion } from 'motion/react';
import { Smile, Clock } from 'lucide-react';
import { Navigation } from '../components/Navigation';

interface TreinarProps {
  onNavigate: (page: 'painel' | 'aulas' | 'tabuada' | 'treinar' | 'planos') => void;
}

export function Treinar({ onNavigate }: TreinarProps) {
  const [selectedMode, setSelectedMode] = useState<'tranquilo' | 'cronometrado'>('tranquilo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white p-6 md:p-8 pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <Navigation currentPage="treinar" onNavigate={onNavigate} />

        <div className="max-w-2xl mx-auto mt-20">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10">
              
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Treino Mental
                </h1>
                <p className="text-white/60">
                  São 10 exercícios pensados pro seu nível atual (4). Escolha o modo:
                </p>
              </div>

              {/* Mode Selection */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedMode('tranquilo')}
                  className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                    selectedMode === 'tranquilo'
                      ? 'border-teal-400 bg-teal-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {selectedMode === 'tranquilo' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                  )}
                  <div className="relative">
                    <div className={`${
                      selectedMode === 'tranquilo' 
                        ? 'bg-gradient-to-br from-teal-500 to-cyan-500' 
                        : 'bg-white/10'
                    } p-4 rounded-2xl w-fit mx-auto mb-4`}>
                      <Smile className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Tranquilo
                    </h3>
                    <p className="text-sm text-white/60">Sem limite de tempo</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedMode('cronometrado')}
                  className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                    selectedMode === 'cronometrado'
                      ? 'border-teal-400 bg-teal-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {selectedMode === 'cronometrado' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                  )}
                  <div className="relative">
                    <div className={`${
                      selectedMode === 'cronometrado' 
                        ? 'bg-gradient-to-br from-orange-500 to-red-500' 
                        : 'bg-white/10'
                    } p-4 rounded-2xl w-fit mx-auto mb-4`}>
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Cronometrado
                    </h3>
                    <p className="text-sm text-white/60">11s por questão</p>
                  </div>
                </motion.button>
              </div>

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30"
              >
                Bora treinar
              </motion.button>

              {/* Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-white/50">
                  Os exercícios se adaptam ao seu desempenho
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
