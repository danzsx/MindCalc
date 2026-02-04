import { useState } from 'react';
import { X, BookOpen, ChevronRight } from 'lucide-react';

interface LessonModalProps {
  lesson: {
    id: number;
    title: string;
    content?: {
      title: string;
      explanation: string;
      example: {
        operation: string;
        steps: { step: number; description: string; highlight?: string }[];
        result: string;
      };
    };
  };
  onClose: () => void;
}

type TabType = 'intro' | 'guided' | 'unguided' | 'free' | 'completed';

export function LessonModal({ lesson, onClose }: LessonModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('intro');

  if (!lesson.content) return null;

  const tabs = [
    { id: 'intro' as TabType, label: 'Intro', icon: '📚' },
    { id: 'guided' as TabType, label: 'Guiado', icon: '🎯' },
    { id: 'unguided' as TabType, label: 'Sem guia', icon: '🔓' },
    { id: 'free' as TabType, label: 'Livre', icon: '🚀' },
    { id: 'completed' as TabType, label: 'Concluído', icon: '✓' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-card rounded-[20px] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-success/10 px-6 lg:px-8 py-6 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                <BookOpen className="text-primary" size={20} />
              </div>
              <div>
                <h2 className="text-foreground mb-1">{lesson.content.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Aprenda uma técnica de cálculo mental
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300
                  ${activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                style={{ fontWeight: activeTab === tab.id ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)' }}
              >
                <span>{tab.icon}</span>
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
          {activeTab === 'intro' && (
            <div className="space-y-6">
              {/* Explanation */}
              <div>
                <p className="text-foreground leading-relaxed">
                  {lesson.content.explanation}
                </p>
              </div>

              {/* Example */}
              <div className="bg-gradient-to-br from-primary/5 to-success/5 rounded-xl p-6 border border-primary/20">
                <h3 className="text-foreground mb-4 flex items-center gap-2">
                  <span>💡</span>
                  <span>Exemplo:</span>
                </h3>

                {/* Operation */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-card px-8 py-4 rounded-xl shadow-sm">
                    <div className="text-3xl" style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-foreground)' }}>
                      {lesson.content.example.operation}
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-3 mb-6">
                  {lesson.content.example.steps.map((step) => (
                    <div key={step.step} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                        {step.step}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">
                          {step.description}
                          {step.highlight && (
                            <span className="ml-2 inline-block bg-secondary/30 text-foreground px-3 py-1 rounded-lg" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                              {step.highlight}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Result */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-primary/20">
                  <span className="text-muted-foreground">Resultado:</span>
                  <span className="text-3xl text-primary" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                    = {lesson.content.example.result}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'intro' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <span className="text-3xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
              </div>
              <h3 className="text-foreground mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-muted-foreground">
                Esta seção será implementada em breve
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 lg:px-8 py-6 border-t border-border bg-muted/30">
          {activeTab === 'intro' ? (
            <button 
              onClick={() => setActiveTab('guided')}
              className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              style={{ fontWeight: 'var(--font-weight-medium)' }}
            >
              <span>Entendi, vamos praticar</span>
              <ChevronRight size={20} />
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveTab('intro')}
                className="flex-1 bg-muted text-foreground px-6 py-4 rounded-xl hover:bg-accent transition-all duration-300"
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                Voltar para Intro
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-[#14B8A6] shadow-md hover:shadow-lg transition-all duration-300"
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                Concluir Aula
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
