import { motion } from 'motion/react';
import { Check, X, Sparkles, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { Navigation } from '../components/Navigation';

interface PlanosProps {
  onNavigate: (page: 'painel' | 'aulas' | 'tabuada' | 'treinar' | 'planos') => void;
}

export function Planos({ onNavigate }: PlanosProps) {
  const freePlan = [
    { available: true, label: '1 treino por dia' },
    { available: true, label: 'Nível máximo 5' },
    { available: false, label: 'Treinos ilimitados' },
    { available: false, label: 'Nível máximo 10' },
    { available: false, label: 'Análise detalhada' },
  ];

  const proPlan = [
    { available: true, label: '1 treino por dia' },
    { available: true, label: 'Nível máximo 5' },
    { available: true, label: 'Treinos ilimitados' },
    { available: true, label: 'Nível máximo 10' },
    { available: true, label: 'Análise detalhada' },
  ];

  const benefits = [
    { icon: Zap, title: 'Treinos sem limite, no seu ritmo' },
    { icon: TrendingUp, title: 'Níveis que acompanham seu crescimento' },
    { icon: BarChart3, title: 'Veja como você está evoluindo, com detalhes' },
    { icon: Sparkles, title: 'Exercícios pensados pra você, sob medida' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white p-6 md:p-8 pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <Navigation currentPage="planos" onNavigate={onNavigate} />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Seu plano
          </h1>
          <p className="text-xl text-white/60">
            Treine no ritmo que faz sentido pra você.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-4">
                  Atual
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Free
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">R$ 0</span>
                  <span className="text-white/50">/mês</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {freePlan.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.available ? (
                      <div className="bg-teal-500/20 p-1 rounded-full">
                        <Check className="w-4 h-4 text-teal-400" />
                      </div>
                    ) : (
                      <div className="bg-white/5 p-1 rounded-full">
                        <X className="w-4 h-4 text-white/30" />
                      </div>
                    )}
                    <span className={feature.available ? 'text-white' : 'text-white/30'}>
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 rounded-2xl border-2 border-white/20 bg-white/5 text-white/50 font-semibold cursor-default">
                Plano Atual
              </button>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-xl border-2 border-teal-500/30 rounded-3xl p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-sm font-medium mb-4">
                  <Sparkles className="w-3 h-3" />
                  Popular
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Pro
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">R$ 19,90</span>
                  <span className="text-white/50">/mês</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {proPlan.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="bg-teal-500/20 p-1 rounded-full">
                      <Check className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-white">{feature.label}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30"
              >
                Assinar Pro
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-10 blur-2xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              O que muda com o Pro?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white/90 leading-relaxed">{benefit.title}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
