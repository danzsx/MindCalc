import { motion } from 'motion/react';
import { Flame, Target, TrendingUp, Zap, BookOpen, Grid3x3, Award, ArrowRight, Plus, Minus, X, Divide } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { StatsCard } from '../components/StatsCard';
import { ProgressItem } from '../components/ProgressItem';

interface DashboardProps {
  onNavigate: (page: 'painel' | 'aulas' | 'tabuada' | 'treinar' | 'planos') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white p-6 md:p-8 pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <Navigation currentPage="painel" onNavigate={onNavigate} />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Olá, Federico! 👋
          </h1>
          <p className="text-xl text-white/60">Pronto para turbinar seu cérebro hoje?</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <StatsCard
            icon={Flame}
            value="7"
            label="Dias de sequência"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            delay={0.1}
          />
          <StatsCard
            icon={Target}
            value="94%"
            label="Precisão"
            gradient="bg-gradient-to-br from-teal-500 to-cyan-500"
            delay={0.2}
          />
          <StatsCard
            icon={TrendingUp}
            value="1.2k"
            label="XP Total"
            gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
            delay={0.3}
          />
          <StatsCard
            icon={Zap}
            value="42"
            label="Treinos"
            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={0.4}
          />
        </div>

        {/* Main Grid - Bento Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Large Card - Aulas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-2xl">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Aulas Interativas
                    </h3>
                    <p className="text-white/60">Aprenda técnicas de cálculo rápido</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/60">Seu progresso</span>
                  <span className="text-2xl font-bold text-teal-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>12%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '12%' }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-white/50">3 de 26 aulas concluídas</p>
              </div>

              <button
                onClick={() => onNavigate('aulas')}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 group/btn"
              >
                <span>Continuar aprendendo</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Tabuada Turbo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-2xl mb-4 w-fit">
                <Grid3x3 className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Tabuada Turbo
              </h3>
              <p className="text-white/60 mb-4 text-sm">Treinos cronometrados de multiplicação</p>

              <div className="bg-white/5 rounded-xl p-3 mb-6">
                <p className="text-xs text-white/50 mb-1">Melhor tempo</p>
                <p className="font-semibold">Multiplicação (1-10) — 18s</p>
              </div>

              <button className="w-full mt-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
                Iniciar treino
              </button>
            </div>
          </motion.div>
        </div>

        {/* Weaknesses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-2xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Áreas para Melhorar
                </h3>
                <p className="text-sm text-white/60">Foque nestas operações para evoluir mais rápido</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
              <p className="text-sm text-white/60 mb-2">💡 Dica personalizada para você</p>
              <p className="text-white/90">
                Pratique mais <strong>subtração</strong> para equilibrar suas habilidades. Tente completar dezenas para facilitar!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <ProgressItem
                label="Subtração (−)"
                value={68}
                color="bg-gradient-to-r from-red-500 to-orange-500"
                delay={0.8}
              />
              <ProgressItem
                label="Divisão (÷)"
                value={72}
                color="bg-gradient-to-r from-orange-500 to-yellow-500"
                delay={0.9}
              />
              <ProgressItem
                label="Adição (+)"
                value={85}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                delay={1.0}
              />
              <ProgressItem
                label="Multiplicação (×)"
                value={91}
                color="bg-gradient-to-r from-blue-500 to-teal-500"
                delay={1.1}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}