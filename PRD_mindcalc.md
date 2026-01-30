# ---

**Spec Técnica — VaptCálculo (MVP)**

Este documento detalha a arquitetura, stack e os arquivos necessários para a implementação do MindCalc, focando em uma experiência adulta, performática e escalável.

## **1\. Stack Tecnológica**

* **Framework:** Next.js 14+ (App Router)  
* **Estilização:** Tailwind CSS \+ shadcn/ui (para componentes sóbrios e profissionais)  
* **Backend/Database:** Supabase (PostgreSQL \+ Auth)  
* **Gerenciamento de Estado:** React Hooks (useContext/useReducer) ou Zustand  
* **IA:** Anthropic SDK (Claude 3.5 Sonnet/Haiku) para geração adaptativa de exercícios  
* **Gráficos:** Recharts (para o Dashboard de evolução)  
* **Deployment:** Vercel

## ---

**2\. Estrutura de Banco de Dados (Supabase)**

### **Tabelas Principais:**

* **profiles**: Armazena nível atual (1-10), streak, e configurações.  
* **sessions**: Registro de cada treino (data, precisão, tempo médio, nível no momento).  
* **exercise\_logs**: Logs individuais de erros e acertos para alimentar o algoritmo adaptativo (números envolvidos, operação, tempo de resposta).

## ---

**3\. Arquivos a Serem Criados**

### **3.1. Frontend: Rotas e Páginas (/app)**

| Arquivo | Descrição |
| :---- | :---- |
| layout.tsx | Root layout com fontes e providers (Auth/Theme) |
| page.tsx | **Landing Page** (Proposta de valor e CTA) |
| (auth)/login/page.tsx | Tela de login/cadastro |
| (app)/onboarding/page.tsx | **Teste Diagnóstico** inicial (5-10 questões) |
| (app)/dashboard/page.tsx | **Dashboard Principal** (Gráficos, Nível, Streak) |
| (app)/train/page.tsx | **Interface de Treino** (Timer, Exercício, Input) |
| (app)/results/\[sessionId\]/page.tsx | Feedback pós-treino e comparação de performance |
| (app)/billing/page.tsx | **Paywall** (Comparativo Free vs. Pro) |

### **3.2. Componentes de UI (/components)**

* **training/**: ExerciseCard.tsx, Timer.tsx, ProgressBar.tsx, Keypad.tsx (opcional).  
* **dashboard/**: EvolutionChart.tsx, StatsSummary.tsx, WeakPointsList.tsx.  
* **shared/**: Navbar.tsx, Footer.tsx, UserMenu.tsx.

### **3.3. Lógica e IA (/lib & /api)**

* **lib/engine.ts**: Lógica de progressão (cálculo de nível e tempo médio aceitável).  
* **api/generate-exercises/route.ts**: Server Action/Route que consulta o histórico no DB e chama a API do Claude para gerar JSON de exercícios personalizados.  
* **hooks/useTrainingSession.ts**: Hook customizado para gerenciar o estado da sessão de treino atual (timer, acertos, lista de questões).

## ---

**4\. Arquivos a Serem Modificados (Configuração)**

* middleware.ts: Para proteger as rotas /dashboard, /train e /onboarding (exigir login).  
* tailwind.config.ts: Customização de cores para evitar o aspecto infantil (tons de azul escuro, cinza ardósia e acentos de produtividade).  
* next.config.js: Configuração de variáveis de ambiente (Supabase URL/Key, Claude API Key).

## ---

**5\. Regras de Evolução (Algoritmo Adaptativo)**

**Nota de Implementação:** O sistema deve priorizar operações onde o exercise\_logs indica falha recorrente ou tempo de resposta acima do standard\_time do nível atual.

1. **Nível 1-3:** Operações simples (soma/subtração \< 50).  
2. **Nível 4-7:** Multiplicação, divisão e números \> 100\.  
3. **Nível 8-10:** Decimais, porcentagens e múltiplas operações combinadas.

---

