import { motion } from 'motion/react';
import { BookOpen, Plus, Minus, X, Divide } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { CategorySection } from '../components/CategorySection';
import { ModernLessonCard } from '../components/ModernLessonCard';

interface LessonsProps {
  onNavigate: (page: 'painel' | 'aulas' | 'tabuada' | 'treinar' | 'planos') => void;
  onStartLesson?: () => void;
}

export function Lessons({ onNavigate, onStartLesson }: LessonsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white p-6 md:p-8 pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <Navigation currentPage="aulas" onNavigate={onNavigate} />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-teal-300 font-medium">26 aulas disponíveis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Sua Jornada de<br />Aprendizado
          </h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Cada aula te deixa mais rápido e confiante no cálculo mental. Continue evoluindo! 🚀
          </p>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-16 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-2xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Progresso Geral
                </h2>
                <p className="text-white/60">Continue assim para desbloquear novas técnicas!</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-teal-400 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  12%
                </div>
                <p className="text-sm text-white/50">3 de 26 concluídas</p>
              </div>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '12%' }}
                transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Adição Category */}
        <CategorySection
          icon={Plus}
          title="Adição +"
          description="Técnicas para somar mais rápido usando arredondamento e decomposição"
          completed={2}
          total={5}
          gradient="bg-gradient-to-r from-emerald-500 to-teal-500"
          delay={0.2}
        >
          <ModernLessonCard
            icon={Plus}
            title="Somar Dezenas Primeiro"
            description="Separe as dezenas e unidades. Some as dezenas, depois as unidades e junte tudo."
            duration="5 min"
            difficulty="easy"
            status="completed"
            gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
            delay={0.3}
            onStart={onStartLesson}
          />
          <ModernLessonCard
            icon={Plus}
            title="Arredondar para 10"
            description="Arredonde um número para a dezena mais próxima, some e depois ajuste o resultado."
            duration="6 min"
            difficulty="easy"
            status="completed"
            gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
            delay={0.4}
            onStart={onStartLesson}
          />
          <ModernLessonCard
            icon={Plus}
            title="Compensação na Soma"
            description="Tire de um número e adicione ao outro para facilitar o cálculo mental."
            duration="7 min"
            difficulty="medium"
            status="available"
            gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
            delay={0.5}
            onStart={onStartLesson}
          />
          <ModernLessonCard
            icon={Plus}
            title="Somar da Esquerda"
            description="Comece somando da esquerda para direita para maior velocidade."
            duration="8 min"
            difficulty="medium"
            status="locked"
            gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
            delay={0.6}
          />
          <ModernLessonCard
            icon={Plus}
            title="Soma de 3+ Números"
            description="Combine técnicas para somar vários números de uma vez só."
            duration="10 min"
            difficulty="hard"
            status="locked"
            gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
            delay={0.7}
          />
        </CategorySection>

        {/* Subtração Category */}
        <CategorySection
          icon={Minus}
          title="Subtração −"
          description="Métodos eficientes de subtração usando completar dezenas e decomposição"
          completed={1}
          total={6}
          gradient="bg-gradient-to-r from-orange-500 to-red-500"
          delay={0.3}
        >
          <ModernLessonCard
            icon={Minus}
            title="Completar a Dezena"
            description="Complete até a dezena mais próxima para facilitar a subtração."
            duration="6 min"
            difficulty="easy"
            status="completed"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            delay={0.4}
          />
          <ModernLessonCard
            icon={Minus}
            title="Subtrair por Partes"
            description="Quebre a subtração em partes menores e mais simples de calcular."
            duration="7 min"
            difficulty="easy"
            status="available"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            delay={0.5}
          />
          <ModernLessonCard
            icon={Minus}
            title="Adicionar para Subtrair"
            description="Pense em quanto falta para chegar ao número maior."
            duration="7 min"
            difficulty="medium"
            status="locked"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            delay={0.6}
          />
          <ModernLessonCard
            icon={Minus}
            title="Subtrair da Esquerda"
            description="Comece pela esquerda para maior velocidade e precisão."
            duration="8 min"
            difficulty="medium"
            status="locked"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            delay={0.7}
          />
          <ModernLessonCard
            icon={Minus}
            title="Números Próximos"
            description="Técnica especial quando os números estão muito próximos."
            duration="6 min"
            difficulty="medium"
            status="locked"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            delay={0.8}
          />
          <ModernLessonCard
            icon={Minus}
            title="Subtrações Complexas"
            description="Combine todas as técnicas para subtrações avançadas."
            duration="12 min"
            difficulty="hard"
            status="locked"
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            delay={0.9}
          />
        </CategorySection>

        {/* Multiplicação Category */}
        <CategorySection
          icon={X}
          title="Multiplicação ×"
          description="Truques e atalhos para multiplicar rapidamente sem calculadora"
          completed={0}
          total={8}
          gradient="bg-gradient-to-r from-blue-500 to-purple-500"
          delay={0.4}
        >
          <ModernLessonCard
            icon={X}
            title="Multiplicar por 5"
            description="Multiplique por 10 e divida por 2 — muito mais rápido!"
            duration="5 min"
            difficulty="easy"
            status="available"
            gradient="bg-gradient-to-br from-blue-500 to-purple-500"
            delay={0.5}
          />
          <ModernLessonCard
            icon={X}
            title="Multiplicar por 9"
            description="Use a técnica 10x - 1x para resultados instantâneos."
            duration="5 min"
            difficulty="easy"
            status="locked"
            gradient="bg-gradient-to-br from-blue-500 to-purple-500"
            delay={0.6}
          />
          <ModernLessonCard
            icon={X}
            title="Multiplicar por 11"
            description="Técnica mágica para multiplicar por 11 mentalmente."
            duration="6 min"
            difficulty="medium"
            status="locked"
            gradient="bg-gradient-to-br from-blue-500 to-purple-500"
            delay={0.7}
          />
        </CategorySection>

        {/* Divisão Category */}
        <CategorySection
          icon={Divide}
          title="Divisão ÷"
          description="Simplifique divisões usando estimativas e divisões sucessivas"
          completed={0}
          total={7}
          gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
          delay={0.5}
        >
          <ModernLessonCard
            icon={Divide}
            title="Dividir por 2 e 4"
            description="Divida por 2 duas vezes para dividir por 4 facilmente."
            duration="6 min"
            difficulty="easy"
            status="available"
            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={0.6}
          />
          <ModernLessonCard
            icon={Divide}
            title="Dividir por 5"
            description="Multiplique por 2 e divida por 10 — muito mais simples!"
            duration="5 min"
            difficulty="easy"
            status="locked"
            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={0.7}
          />
          <ModernLessonCard
            icon={Divide}
            title="Estimativa de Divisão"
            description="Aprenda a estimar divisões rapidamente para resultados aproximados."
            duration="8 min"
            difficulty="medium"
            status="locked"
            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            delay={0.8}
          />
        </CategorySection>
      </div>
    </div>
  );
}