export function WeakPointsSection() {
  const weakPoints = [
    { operation: 'Subtração (−)', errorRate: 62, color: '#FB923C' },
    { operation: 'Multiplicação (×)', errorRate: 50, color: '#FB923C' },
    { operation: 'Divisão (÷)', errorRate: 50, color: '#FB923C' },
    { operation: 'Adição (+)', errorRate: 29, color: '#10B981' },
  ];

  return (
    <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
      <h2 className="text-foreground mb-6">Pontos Fracos</h2>
      
      <div className="space-y-5">
        {weakPoints.map((point, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-foreground" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {point.operation}
              </span>
              <span 
                className="text-sm" 
                style={{ 
                  fontWeight: 'var(--font-weight-semibold)',
                  color: point.errorRate > 40 ? '#FB923C' : '#10B981'
                }}
              >
                {point.errorRate}% de erro
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${point.errorRate}%`,
                  backgroundColor: point.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20">
        <p className="text-sm text-muted-foreground">
          💡 <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-foreground)' }}>
            Dica:
          </span> Foque em praticar subtração e multiplicação para melhorar sua precisão geral
        </p>
      </div>
    </div>
  );
}
