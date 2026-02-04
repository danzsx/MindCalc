import { useState } from 'react';
import { BookOpen, CheckCircle, Lock, Circle } from 'lucide-react';
import { LessonModal } from '@/app/components/LessonModal';

interface Lesson {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'available' | 'locked';
  icon: string;
  content?: {
    title: string;
    explanation: string;
    example: {
      operation: string;
      steps: { step: number; description: string; highlight?: string }[];
      result: string;
    };
  };
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Somar dezenas primeiro',
    description: 'Aprenda a somar separando as dezenas para facilitar o cálculo.',
    status: 'completed',
    icon: '+',
    content: {
      title: 'Somar dezenas primeiro',
      explanation: 'Quando somamos dois números, fica mais fácil separar as dezenas e as unidades. Primeiro somamos as dezenas, depois as unidades, e no final juntamos tudo.',
      example: {
        operation: '37 + 48',
        steps: [
          { step: 1, description: 'Dezenas: 30 + 40 = 70' },
          { step: 2, description: 'Unidades: 7 + 8 = 15' },
          { step: 3, description: 'Juntando: 70 + 15 = 85', highlight: '85' }
        ],
        result: '85'
      }
    }
  },
  {
    id: 2,
    title: 'Somar arredondando para 10',
    description: 'Arredonde um dos números para a dezena mais próxima e depois ajuste.',
    status: 'available',
    icon: '+',
    content: {
      title: 'Somar arredondando para 10',
      explanation: 'Uma técnica útil é arredondar um número para a dezena mais próxima, fazer a soma, e depois ajustar o resultado.',
      example: {
        operation: '47 + 28',
        steps: [
          { step: 1, description: 'Arredonde 28 para 30 (adicione 2)' },
          { step: 2, description: 'Some: 47 + 30 = 77' },
          { step: 3, description: 'Ajuste: 77 - 2 = 75', highlight: '75' }
        ],
        result: '75'
      }
    }
  },
  {
    id: 3,
    title: 'Subtrair completando a dezena',
    description: 'Complete a dezena para subtrair de forma mais simples.',
    status: 'locked',
    icon: '−'
  },
  {
    id: 4,
    title: 'Subtrair por partes',
    description: 'Divida a subtração em partes menores para calcular mais fácil.',
    status: 'locked',
    icon: '−'
  },
  {
    id: 5,
    title: 'Multiplicar por 5 (metade de 10x)',
    description: 'Multiplique por 10 e divida por 2 — muito mais rápido!',
    status: 'locked',
    icon: '×'
  },
  {
    id: 6,
    title: 'Multiplicar por 9 (10x - 1x)',
    description: 'Multiplique por 10 e subtraia o número original.',
    status: 'locked',
    icon: '×'
  },
  {
    id: 7,
    title: 'Dividir por 2 e por 4 (metade da metade)',
    description: 'Divida por 2 duas vezes para dividir por 4 facilmente.',
    status: 'locked',
    icon: '÷'
  },
  {
    id: 8,
    title: 'Dividir pensando na multiplicação',
    description: 'Transforme a divisão em uma pergunta de multiplicação.',
    status: 'locked',
    icon: '÷'
  }
];

export function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-success" size={20} />;
      case 'available':
        return <Circle className="text-primary" size={20} />;
      case 'locked':
        return <Lock className="text-muted-foreground" size={20} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'Concluído', color: 'text-success' };
      case 'available':
        return { text: 'Disponível', color: 'text-primary' };
      case 'locked':
        return { text: 'Bloqueado', color: 'text-muted-foreground' };
      default:
        return { text: '', color: '' };
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.status !== 'locked') {
      setSelectedLesson(lesson);
    }
  };

  return (
    <>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-foreground mb-2">Aulas Interativas</h1>
          <p className="text-muted-foreground">
            Cada aula ensina uma técnica prática de cálculo mental
          </p>
        </div>

        {/* Lessons List */}
        <div className="grid gap-4 lg:gap-5">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => handleLessonClick(lesson)}
              disabled={lesson.status === 'locked'}
              className={`
                bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] 
                text-left w-full transition-all duration-300
                ${lesson.status === 'locked' 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  ${lesson.status === 'completed' ? 'bg-success/10 text-success' : 
                    lesson.status === 'available' ? 'bg-primary/10 text-primary' : 
                    'bg-muted text-muted-foreground'}
                `}>
                  {lesson.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lesson.description}
                  </p>
                </div>

                {/* Status */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {getStatusIcon(lesson.status)}
                  <span className={`text-sm ${getStatusText(lesson.status).color}`} style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    {getStatusText(lesson.status).text}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BookOpen className="text-primary" size={20} />
            </div>
            <h3 className="text-foreground">Seu Progresso</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Você completou 1 de 8 aulas. Continue assim!
          </p>
          <div className="w-full h-3 bg-primary/20 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-500"
              style={{ width: '12.5%' }}
            />
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      {selectedLesson && (
        <LessonModal 
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </>
  );
}
