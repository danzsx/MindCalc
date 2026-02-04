import { BookOpen } from 'lucide-react';

interface InteractiveSectionProps {
  onNavigateToLessons?: () => void;
}

export function InteractiveSection({ onNavigateToLessons }: InteractiveSectionProps) {
  return (
    <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <BookOpen className="text-primary" size={20} />
        </div>
        <h2 className="text-foreground">Aulas Interativas</h2>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Aprenda técnicas para calcular mais rápido
      </p>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Progresso</span>
        <span className="text-sm" style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)' }}>
          1 de 8 aulas
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-3 bg-primary/20 rounded-full overflow-hidden mb-6">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-500"
          style={{ width: '12.5%' }}
        />
      </div>
      
      <button 
        onClick={onNavigateToLessons}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-primary hover:text-[#14B8A6] px-6 py-2 rounded-lg hover:bg-primary/5 transition-all duration-300"
      >
        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>Ver Aulas</span>
      </button>
    </div>
  );
}
