import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Home } from 'lucide-react';
import { LessonProgress } from '../components/LessonProgress';
import { LessonContent } from '../components/LessonContent';
import { VisualExample } from '../components/VisualExample';
import { PizzaVisual } from '../components/PizzaVisual';

interface LessonViewProps {
  onBack: () => void;
  onHome: () => void;
}

export function LessonView({ onBack, onHome }: LessonViewProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Lesson completed, go back
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Aulas</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Frações: metade, terço e quarto
              </h2>
              <p className="text-sm text-white/60">Aula básica • 8 minutos</p>
            </div>
          </div>

          <button
            onClick={onHome}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Mobile Title */}
        <div className="md:hidden mb-8 text-center">
          <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Frações: metade, terço e quarto
          </h2>
          <p className="text-sm text-white/60">Aula básica • 8 minutos</p>
        </div>

        {/* Progress Stepper */}
        <LessonProgress currentStep={currentStep} totalSteps={5} />

        {/* Lesson Content Based on Step */}
        {currentStep === 0 && (
          <LessonContent
            title="Frações: metade, terço e quarto"
            tip="Fração parece difícil? Relaxa! Vamos entender usando algo que todo mundo ama: pizza! 🍕"
            onNext={handleNext}
            buttonText="Bora aprender!"
          >
            <VisualExample caption="Uma pizza inteira. Delícia, né?">
              <PizzaVisual />
            </VisualExample>
          </LessonContent>
        )}

        {currentStep === 1 && (
          <LessonContent
            title="Dividindo a Pizza"
            tip="Quando você divide a pizza em 2 partes iguais, cada parte é METADE (1/2). Se dividir em 3 partes, cada uma é um TERÇO (1/3). E em 4 partes? Cada uma é um QUARTO (1/4)!"
            onNext={handleNext}
            buttonText="Entendi!"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <VisualExample caption="Metade (1/2)">
                <PizzaVisual slices={2} highlightedSlices={[0]} />
              </VisualExample>
              <VisualExample caption="Terço (1/3)">
                <PizzaVisual slices={3} highlightedSlices={[0]} />
              </VisualExample>
              <VisualExample caption="Quarto (1/4)">
                <PizzaVisual slices={4} highlightedSlices={[0]} />
              </VisualExample>
            </div>
          </LessonContent>
        )}

        {currentStep === 2 && (
          <LessonContent
            title="Hora de Praticar!"
            tip="Se você pegar 2 fatias de uma pizza dividida em 4 partes iguais, você tem 2/4. Mas perceba: 2/4 é a mesma coisa que 1/2 (metade)!"
            onNext={handleNext}
            buttonText="Próximo exercício"
          >
            <VisualExample caption="2 fatias de 4 = 2/4 = 1/2">
              <PizzaVisual slices={4} highlightedSlices={[0, 1]} />
            </VisualExample>
          </LessonContent>
        )}

        {currentStep === 3 && (
          <LessonContent
            title="Agora é com Você!"
            tip="Tente visualizar: se uma pizza está dividida em 3 partes e você come 2, quanto sobrou? Resposta: 1/3 (um terço)."
            onNext={handleNext}
            buttonText="Continuar"
          >
            <VisualExample caption="Sobrou apenas 1/3 da pizza">
              <PizzaVisual slices={3} highlightedSlices={[2]} />
            </VisualExample>
          </LessonContent>
        )}

        {currentStep === 4 && (
          <LessonContent
            title="Parabéns! 🎉"
            tip="Você aprendeu o básico de frações! Agora você sabe que frações são apenas formas de dividir coisas em partes iguais. Continue praticando!"
            onNext={handleNext}
            buttonText="Finalizar aula"
            showTip={false}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-20 blur-3xl"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="text-8xl mb-6"
                >
                  🏆
                </motion.div>
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Missão Cumprida!
                </h3>
                <p className="text-white/70 text-lg mb-6">
                  Você dominou as frações básicas: metade, terço e quarto.
                </p>
                <div className="flex items-center justify-center gap-8 text-center">
                  <div className="bg-white/5 px-6 py-4 rounded-2xl">
                    <div className="text-3xl font-bold text-teal-400 mb-1">+50</div>
                    <div className="text-sm text-white/60">XP ganhos</div>
                  </div>
                  <div className="bg-white/5 px-6 py-4 rounded-2xl">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">100%</div>
                    <div className="text-sm text-white/60">Precisão</div>
                  </div>
                </div>
              </div>
            </div>
          </LessonContent>
        )}
      </div>
    </div>
  );
}
