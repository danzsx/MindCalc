import { Check, X } from 'lucide-react';

type Feature = {
  text: string;
  available: boolean;
};

type Plan = {
  name: string;
  price: string;
  period: string;
  features: Feature[];
  current?: boolean;
  highlighted?: boolean;
};

export function BillingPage() {
  const plans: Plan[] = [
    {
      name: 'Free',
      price: 'R$ 0',
      period: '/mês',
      current: true,
      features: [
        { text: '1 treino por dia', available: true },
        { text: 'Nível máximo 5', available: true },
        { text: 'Treinos ilimitados', available: false },
        { text: 'Nível máximo 10', available: false },
        { text: 'Relatórios com IA', available: false },
      ],
    },
    {
      name: 'Pro',
      price: 'R$ 19,90',
      period: '/mês',
      highlighted: true,
      features: [
        { text: '1 treino por dia', available: true },
        { text: 'Nível máximo 5', available: true },
        { text: 'Treinos ilimitados', available: true },
        { text: 'Nível máximo 10', available: true },
        { text: 'Relatórios com IA', available: true },
      ],
    },
  ];

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-foreground mb-3">Escolha seu plano</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Desbloqueie todo o potencial do MindCalc com o plano Pro.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`
              bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]
              transition-all duration-300
              ${plan.highlighted 
                ? 'ring-2 ring-primary shadow-[0_15px_25px_-5px_rgba(45,212,191,0.2)] md:scale-105' 
                : ''
              }
            `}
          >
            {/* Plan Header */}
            <div className="mb-6">
              <h2 className="text-foreground mb-4">{plan.name}</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl lg:text-5xl text-foreground" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${
                    feature.available ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {feature.available ? (
                      <Check size={20} strokeWidth={2.5} />
                    ) : (
                      <X size={20} strokeWidth={2} />
                    )}
                  </div>
                  <span className={`${
                    feature.available ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            {plan.current ? (
              <button
                disabled
                className="w-full bg-muted text-muted-foreground px-6 py-4 rounded-xl cursor-not-allowed min-h-[56px]"
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                Plano Atual
              </button>
            ) : (
              <button
                className={`
                  w-full px-6 py-4 rounded-xl min-h-[56px]
                  shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
                  transition-all duration-300
                  ${plan.highlighted 
                    ? 'bg-primary text-primary-foreground hover:bg-[#14B8A6]' 
                    : 'bg-muted text-foreground hover:bg-accent'
                  }
                `}
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                Assinar Pro
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
          <h3 className="text-foreground mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Por que escolher o Pro?</span>
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Treine quantas vezes quiser, sem limitações diárias</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Acesse exercícios mais avançados (níveis 6-10)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Receba análises detalhadas com Inteligência Artificial</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
