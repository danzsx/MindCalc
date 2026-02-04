import Link from "next/link";
import { Check, TrendingUp, Brain, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-primary cursor-pointer"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              MindCalc
            </h1>
            <Link
              href="/login"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-[#14B8A6] transition-all duration-300 font-medium"
            >
              Começar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Headline */}
            <h1 className="text-foreground mb-8 leading-tight text-4xl lg:text-6xl">
              Cálculo mental sem travar,
              <br />
              <span className="text-primary">do jeito que faz sentido</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Se você sempre teve dificuldade com números, o MindCalc é pra
              você. Aqui você aprende com macetes simples, treinos curtos e no
              seu ritmo.
            </p>

            {/* CTA Principal */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-5 rounded-xl hover:bg-[#14B8A6] shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg min-h-[56px] font-medium"
            >
              Começar do jeito fácil
            </Link>

            <p className="text-sm text-muted-foreground mt-4">
              Grátis para começar • Sem pressão, sem julgamento
            </p>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4">
              Pensado para quem tem dificuldade real
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              O MindCalc não é mais um app de matemática chato. É uma forma
              diferente de aprender a pensar com números.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1: Adaptativo */}
            <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.1)] transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-6">
                <TrendingUp className="text-primary" size={28} />
              </div>
              <h3 className="text-foreground mb-3">Se adapta a você</h3>
              <p className="text-muted-foreground leading-relaxed">
                O app percebe o seu nível real e vai ajustando as contas. Sem te
                forçar, sem te jogar em níveis impossíveis. Você avança conforme
                vai ficando mais confortável.
              </p>
            </div>

            {/* Benefit 2: Tracking */}
            <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.1)] transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary/20 rounded-xl mb-6">
                <Sparkles className="text-secondary" size={28} />
              </div>
              <h3 className="text-foreground mb-3">Você vê sua evolução</h3>
              <p className="text-muted-foreground leading-relaxed">
                Acompanhe seu progresso de um jeito visual e simples. Veja onde
                você melhorou, quais contas estão ficando mais fáceis. Sem
                pressão, só clareza.
              </p>
            </div>

            {/* Benefit 3: IA */}
            <div className="bg-card rounded-[20px] p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.1)] transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-6">
                <Brain className="text-primary" size={28} />
              </div>
              <h3 className="text-foreground mb-3">IA que te ajuda a pensar</h3>
              <p className="text-muted-foreground leading-relaxed">
                A inteligência artificial do MindCalc não é complicada: ela só te
                dá dicas e macetes quando você trava. Como ter alguém paciente do
                seu lado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-foreground mb-6">
                Aprenda com macetes, não com fórmulas
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Aqui você não vai decorar regras difíceis. Vai aprender jeitos
                práticos de pensar que realmente funcionam no dia a dia.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Check
                      className="text-success"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <div className="text-foreground mb-1 font-medium">
                      Treinos de 3 minutos
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Exercícios rápidos que cabem na sua rotina, sem ocupar seu
                      dia
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Check
                      className="text-success"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <div className="text-foreground mb-1 font-medium">
                      Aulas explicadas com calma
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Cada conceito vem com exemplos claros, sem pressa
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Check
                      className="text-success"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <div className="text-foreground mb-1 font-medium">
                      Sem punição por erros
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Errou? Sem problema. O app não te julga, só te ajuda a
                      entender
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Check
                      className="text-success"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <div className="text-foreground mb-1 font-medium">
                      Progresso no seu ritmo
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Não tem pressa. Você avança quando se sentir pronto
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-[20px] p-8 lg:p-12 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                  <div className="text-primary mb-2 font-semibold">
                    💡 Exemplo de macete
                  </div>
                  <p className="text-foreground mb-3">Multiplicar por 5?</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    &quot;Divide por 2 e coloca um zero no final.&quot;
                    <br />
                    <span className="text-primary">36 × 5 = ?</span>
                    <br />
                    36 ÷ 2 = 18 →{" "}
                    <span className="text-primary">180</span>
                  </p>
                </div>

                <div className="bg-secondary/10 rounded-xl p-6 border border-secondary/30">
                  <div className="text-foreground mb-2 font-semibold">
                    ✨ Resultado
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Com o tempo, você para de travar e começa a calcular
                    naturalmente, sem precisar pensar muito.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-foreground mb-12">Para quem é o MindCalc?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] text-left">
              <div className="text-2xl mb-3">🙋‍♀️</div>
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">
                  Se você sempre teve dificuldade com matemática
                </span>
                <br />e sente que trava na hora de fazer contas de cabeça
              </p>
            </div>

            <div className="bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] text-left">
              <div className="text-2xl mb-3">💼</div>
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">
                  Se você precisa calcular no trabalho ou no dia a dia
                </span>
                <br />e quer parar de depender tanto da calculadora
              </p>
            </div>

            <div className="bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] text-left">
              <div className="text-2xl mb-3">😰</div>
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">
                  Se você tem ansiedade com números
                </span>
                <br />e já passou por experiências ruins na escola
              </p>
            </div>

            <div className="bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] text-left">
              <div className="text-2xl mb-3">🎯</div>
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">
                  Se você quer melhorar sem pressão
                </span>
                <br />e aprender do jeito que faz sentido pra você
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-foreground mb-6">
            Pronto para parar de travar com números?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Comece agora e veja como calcular mentalmente pode ser mais fácil do
            que você imagina.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-5 rounded-xl hover:bg-[#14B8A6] shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg min-h-[56px] font-medium"
          >
            Começar agora
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            Grátis para sempre • Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div
              className="text-primary"
              style={{
                fontFamily: "var(--font-family-display)",
                fontSize: "1.5rem",
              }}
            >
              MindCalc
            </div>
            <p className="text-muted-foreground text-sm text-center">
              Cálculo mental sem travar, do jeito que faz sentido
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
