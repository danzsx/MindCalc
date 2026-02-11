import Link from "next/link";
import { Check, TrendingUp, Brain, Sparkles, ArrowRight, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* ── Animated background shapes ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="landing-shape landing-shape-1" />
        <div className="landing-shape landing-shape-2" />
        <div className="landing-shape landing-shape-3" />
        <div className="landing-shape landing-shape-4" />
        <div className="landing-noise" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#7C3AED] flex items-center justify-center">
                <Zap className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <span
                className="text-xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                MindCalc
              </span>
            </div>
            <Link
              href="/login"
              className="group relative bg-foreground text-background px-6 py-2.5 rounded-full font-medium text-sm hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              Começar
              <span className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-28 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center landing-stagger">
            {/* Badge */}
            <div className="landing-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Matemática mental sem complicação
              </span>
            </div>

            {/* Headline */}
            <h1
              className="landing-fade-up text-foreground text-[2.75rem] lg:text-[4.5rem] leading-[1.08] tracking-tight"
              style={{ animationDelay: "100ms" }}
            >
              Cálculo mental
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-[#7C3AED] bg-clip-text text-transparent">
                  sem travar
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 lg:h-4 bg-primary/15 rounded-sm -z-0" />
              </span>
              ,
              <br />
              do jeito que faz sentido
            </h1>

            {/* Subtitle */}
            <p
              className="landing-fade-up text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mt-8"
              style={{ animationDelay: "200ms", lineHeight: "var(--leading-relaxed)" }}
            >
              Se você sempre teve dificuldade com números, o MindCalc é pra
              você. Aqui você aprende com macetes simples, treinos curtos e no
              seu ritmo.
            </p>

            {/* CTA Group */}
            <div
              className="landing-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[#10B981] text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-[0_8px_30px_-4px_rgba(45,212,191,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(45,212,191,0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Começar do jeito fácil
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-sm text-muted-foreground">
                Grátis para começar · Sem pressão
              </span>
            </div>
          </div>
        </div>

        {/* Hero decorative math elements */}
        <div className="absolute top-16 left-[8%] landing-float text-primary/10 text-7xl font-bold select-none" style={{ fontFamily: "var(--font-family-display)" }}>+</div>
        <div className="absolute bottom-20 right-[10%] landing-float text-[#7C3AED]/10 text-8xl font-bold select-none" style={{ animationDelay: "1s", fontFamily: "var(--font-family-display)" }}>÷</div>
        <div className="absolute top-1/3 right-[5%] landing-float text-primary/8 text-6xl font-bold select-none" style={{ animationDelay: "2s", fontFamily: "var(--font-family-display)" }}>7</div>
        <div className="absolute bottom-1/4 left-[5%] landing-float text-[#7C3AED]/8 text-5xl font-bold select-none" style={{ animationDelay: "1.5s", fontFamily: "var(--font-family-display)" }}>×</div>
      </section>

      {/* ── Benefits Section ── */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-section-title text-foreground text-2xl lg:text-3xl" style={{ marginBottom: "var(--space-lg)" }}>
              Pensado para quem tem dificuldade real
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" style={{ lineHeight: "var(--leading-relaxed)" }}>
              O MindCalc não é mais um app de matemática chato. É uma forma
              diferente de aprender a pensar com números.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Benefit 1 */}
            <div className="group relative bg-card rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1" style={{ padding: "var(--space-2xl)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[4rem] rounded-tr-3xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Se adapta a você</h3>
                <p className="text-body-primary text-muted-foreground" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  O app percebe o seu nível real e vai ajustando as contas. Sem te
                  forçar, sem te jogar em níveis impossíveis. Você avança conforme
                  vai ficando mais confortável.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="group relative bg-card rounded-3xl border border-border/50 hover:border-secondary/30 transition-all duration-300 hover:-translate-y-1" style={{ padding: "var(--space-2xl)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-secondary/8 to-transparent rounded-bl-[4rem] rounded-tr-3xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="text-secondary" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Você vê sua evolução</h3>
                <p className="text-body-primary text-muted-foreground" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  Acompanhe seu progresso de um jeito visual e simples. Veja onde
                  você melhorou, quais contas estão ficando mais fáceis. Sem
                  pressão, só clareza.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="group relative bg-card rounded-3xl border border-border/50 hover:border-[#7C3AED]/30 transition-all duration-300 hover:-translate-y-1" style={{ padding: "var(--space-2xl)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#7C3AED]/5 to-transparent rounded-bl-[4rem] rounded-tr-3xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#7C3AED]/15 to-[#7C3AED]/5 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="text-[#7C3AED]" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">IA que te ajuda a pensar</h3>
                <p className="text-body-primary text-muted-foreground" style={{ lineHeight: "var(--leading-relaxed)" }}>
                  A inteligência artificial do MindCalc não é complicada: ela só te
                  dá dicas e macetes quando você trava. Como ter alguém paciente do
                  seu lado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-muted/60 to-muted/40 -z-[1]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-foreground text-2xl lg:text-3xl font-semibold" style={{ marginBottom: "var(--space-lg)" }}>
              Quem já está aprendendo com a gente
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" style={{ lineHeight: "var(--leading-relaxed)" }}>
              Pessoas reais que testaram o MindCalc e estão vendo resultados no
              dia a dia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                name: "Marina, 34 anos",
                role: "Assistente administrativa",
                initial: "M",
                color: "from-primary to-[#10B981]",
                text: "Eu sempre tive bloqueio com matemática. Quando precisava fazer contas na frente de alguém, travava completamente. Comecei com o MindCalc há 3 semanas e já consigo somar valores de cabeça no trabalho. A diferença é que aqui ninguém me julga se eu erro.",
              },
              {
                name: "Roberto, 41 anos",
                role: "Gerente de loja",
                initial: "R",
                color: "from-[#7C3AED] to-primary",
                text: "Sempre dependi da calculadora do celular pra tudo. Os treinos de 3 minutos cabem na minha rotina corrida, e os macetes são muito mais fáceis do que decorar fórmulas. Hoje já faço contas básicas de cabeça e isso me deu mais segurança no trabalho.",
              },
              {
                name: "Carla, 28 anos",
                role: "Designer freelancer",
                initial: "C",
                color: "from-primary to-secondary",
                text: "Eu tinha muita ansiedade com números por causa da escola. O MindCalc é diferente de tudo que já vi: as explicações são calmas, não tem pressão de tempo, e eu posso voltar quantas vezes quiser. Pela primeira vez estou gostando de aprender matemática.",
              },
              {
                name: "Paulo, 37 anos",
                role: "Motorista de app",
                initial: "P",
                color: "from-[#7C3AED] to-[#10B981]",
                text: "Preciso calcular corridas e gorjetas o tempo todo. Antes ficava perdido e demorava muito. Com os macetes do app, consigo fazer estimativas rápidas de cabeça. Parece bobagem mas isso mudou meu dia a dia.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="group bg-card rounded-3xl border border-border/50 p-7 lg:p-8 hover:border-border transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`flex-shrink-0 w-11 h-11 bg-gradient-to-br ${t.color} rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-sm`}>
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-body-emphasis text-foreground font-medium">{t.name}</div>
                    <div className="text-caption text-muted-foreground">{t.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[0.9375rem]">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features / Macetes Section ── */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-foreground text-2xl lg:text-3xl font-semibold" style={{ marginBottom: "var(--grid-gap)" }}>
                Aprenda com macetes,
                <br />
                <span className="text-primary">não com fórmulas</span>
              </h2>
              <p className="text-muted-foreground text-lg" style={{ marginBottom: "var(--section-gap)", lineHeight: "var(--leading-relaxed)" }}>
                Aqui você não vai decorar regras difíceis. Vai aprender jeitos
                práticos de pensar que realmente funcionam no dia a dia.
              </p>

              <div className="space-y-5">
                {[
                  { title: "Treinos de 3 minutos", desc: "Exercícios rápidos que cabem na sua rotina, sem ocupar seu dia" },
                  { title: "Aulas explicadas com calma", desc: "Cada conceito vem com exemplos claros, sem pressa" },
                  { title: "Sem punição por erros", desc: "Errou? Sem problema. O app não te julga, só te ajuda a entender" },
                  { title: "Progresso no seu ritmo", desc: "Não tem pressa. Você avança quando se sentir pronto" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center">
                      <Check className="text-success" size={14} strokeWidth={3} />
                    </div>
                    <div>
                      <div className="text-foreground font-medium mb-0.5">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Macete demo card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-[#7C3AED]/5 to-transparent rounded-[2rem] blur-xl" />
              <div className="relative bg-card rounded-3xl border border-border/50 p-8 lg:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)]">
                <div className="space-y-5">
                  <div className="bg-gradient-to-br from-primary/8 to-primary/3 rounded-2xl p-6 border border-primary/15">
                    <div className="flex items-center gap-2 text-primary mb-3">
                      <Zap size={16} strokeWidth={2.5} />
                      <span className="font-semibold text-sm">Exemplo de macete</span>
                    </div>
                    <p className="text-foreground font-medium mb-3">Multiplicar por 5?</p>
                    <div className="text-muted-foreground text-sm leading-relaxed">
                      <p className="mb-2">&ldquo;Divide por 2 e coloca um zero no final.&rdquo;</p>
                      <div className="flex items-center gap-3 mt-3 py-3 px-4 bg-background/60 rounded-xl">
                        <span className="text-primary font-mono font-semibold">36 × 5</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-mono text-muted-foreground">36 ÷ 2 = 18</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-primary font-mono font-bold text-lg">180</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#7C3AED]/8 to-[#7C3AED]/3 rounded-2xl p-6 border border-[#7C3AED]/15">
                    <div className="flex items-center gap-2 text-[#7C3AED] mb-2">
                      <Sparkles size={16} strokeWidth={2.5} />
                      <span className="font-semibold text-sm">Resultado</span>
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
        </div>
      </section>

      {/* ── "Para quem é" Section ── */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-muted/60 to-muted/40 -z-[1]" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-foreground text-2xl lg:text-3xl font-semibold" style={{ marginBottom: "var(--space-3xl)" }}>
            Para quem é o MindCalc?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { emoji: "🙋‍♀️", bold: "Se você sempre teve dificuldade com matemática", rest: "e sente que trava na hora de fazer contas de cabeça" },
              { emoji: "💼", bold: "Se você precisa calcular no trabalho ou no dia a dia", rest: "e quer parar de depender tanto da calculadora" },
              { emoji: "😰", bold: "Se você tem ansiedade com números", rest: "e já passou por experiências ruins na escola" },
              { emoji: "🎯", bold: "Se você quer melhorar sem pressão", rest: "e aprender do jeito que faz sentido pra você" },
            ].map((item, i) => (
              <div key={i} className="group bg-card rounded-3xl border border-border/50 p-6 text-left hover:border-primary/20 transition-all duration-300">
                <div className="text-2xl mb-3 group-hover:scale-110 inline-block transition-transform duration-300">{item.emoji}</div>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">{item.bold}</span>
                  <br />{item.rest}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          {/* Decorative ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/5 -z-[1]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-[#7C3AED]/5 -z-[1]" />

          <h2 className="text-foreground text-2xl lg:text-4xl font-semibold" style={{ marginBottom: "var(--grid-gap)" }}>
            Pronto para parar de
            <br />
            <span className="bg-gradient-to-r from-primary to-[#7C3AED] bg-clip-text text-transparent">
              travar com números?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10" style={{ lineHeight: "var(--leading-relaxed)" }}>
            Comece agora e veja como calcular mentalmente pode ser mais fácil do
            que você imagina.
          </p>

          <Link
            href="/login"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[#10B981] text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-[0_8px_30px_-4px_rgba(45,212,191,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(45,212,191,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Começar agora
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-sm text-muted-foreground mt-5">
            Grátis para sempre · Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-[#7C3AED] flex items-center justify-center">
                <Zap className="text-white" size={14} />
              </div>
              <span
                className="text-foreground font-medium"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                MindCalc
              </span>
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
