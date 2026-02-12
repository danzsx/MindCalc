-- =============================================
-- Seed — 21 aulas do MindCalc
-- Executar apos a migration 001_lessons_tables.sql
-- =============================================

insert into public.lessons (slug, title, description, technique, operator, sort_order, difficulty, category)
values
  -- Basicas (sort_order 1-99)
  (
    'somar-dezenas-primeiro',
    'Somar dezenas primeiro',
    'Aprenda a somar separando as dezenas para facilitar o calculo.',
    'Somar dezenas primeiro',
    '+',
    1,
    'beginner',
    'basicas'
  ),
  (
    'somar-arredondando',
    'Somar arredondando para 10',
    'Arredonde um dos numeros para a dezena mais proxima e depois ajuste.',
    'Somar arredondando para 10',
    '+',
    2,
    'beginner',
    'basicas'
  ),
  (
    'subtrair-completando',
    'Subtrair completando a dezena',
    'Complete a dezena para subtrair de forma mais simples.',
    'Subtrair completando a dezena',
    '-',
    3,
    'beginner',
    'basicas'
  ),
  (
    'subtrair-por-partes',
    'Subtrair por partes',
    'Quebre a subtracao em partes menores para calcular mais facil.',
    'Subtrair por partes',
    '-',
    4,
    'beginner',
    'basicas'
  ),
  (
    'multiplicar-por-5',
    'Multiplicar por 5 (metade de 10x)',
    'Multiplique por 10 e divida por 2 — muito mais rapido!',
    'Multiplicar por 5 (metade de 10x)',
    '*',
    5,
    'intermediate',
    'basicas'
  ),
  (
    'multiplicar-por-9',
    'Multiplicar por 9 (10x - 1x)',
    'Multiplique por 10 e subtraia o numero original.',
    'Multiplicar por 9 (10x - 1x)',
    '*',
    6,
    'intermediate',
    'basicas'
  ),
  (
    'dividir-por-2-e-4',
    'Dividir por 2 e por 4 (metade da metade)',
    'Divida por 2 duas vezes para dividir por 4 facilmente.',
    'Dividir por 2 e por 4 (metade da metade)',
    '/',
    7,
    'intermediate',
    'basicas'
  ),
  (
    'dividir-pensando-na-multiplicacao',
    'Dividir pensando na multiplicacao',
    'Transforme a divisao em uma pergunta de multiplicacao.',
    'Dividir pensando na multiplicacao',
    '/',
    8,
    'intermediate',
    'basicas'
  ),
  (
    'estimativas-simples',
    'Estimativas: arredondar para calcular rapido',
    'Arredonde os numeros para a dezena mais proxima e estime o resultado.',
    'Estimativa por arredondamento',
    '+',
    9,
    'beginner',
    'basicas'
  ),
  -- Dia a Dia (sort_order 100-199)
  (
    'porcentagem-10',
    'Porcentagem: o jeito facil de calcular 10%',
    'Aprenda a calcular 10% de qualquer valor dividindo por 10.',
    'Porcentagem 10%',
    '/',
    101,
    'beginner',
    'dia-a-dia'
  ),
  (
    'porcentagem-quanto-e',
    'Porcentagem: encontrar quanto % e um valor',
    'Descubra que porcentagem um valor representa de outro usando parte x 100.',
    'Porcentagem - encontrar percentual',
    '/',
    102,
    'beginner',
    'dia-a-dia'
  ),
  (
    'fracao-metade-terco-quarto',
    'Fracao: entendendo metade, um terco e um quarto',
    'Fracoes do jeito simples: dividir em partes iguais.',
    'Fracoes basicas',
    '/',
    103,
    'beginner',
    'dia-a-dia'
  ),
  (
    'fracao-somar-subtrair',
    'Fracao: somar e subtrair fracoes simples',
    'Aprenda a somar fracoes encontrando cada parte e depois somando.',
    'Fracoes - somar e subtrair',
    '+',
    104,
    'beginner',
    'dia-a-dia'
  ),
  (
    'regra-de-3-proporcao',
    'Regra de 3: resolver problemas de proporcao',
    'Use valor unitario e multiplique pela nova quantidade.',
    'Regra de 3 direta',
    '*',
    105,
    'intermediate',
    'dia-a-dia'
  ),
  (
    'regra-de-3-inversa',
    'Regra de 3: problemas inversos',
    'Quando um valor aumenta, o outro diminui. Pense no trabalho total.',
    'Regra de 3 inversa',
    '/',
    106,
    'intermediate',
    'dia-a-dia'
  ),
  (
    'comparacao-de-precos',
    'Comparacao de precos: qual vale mais a pena?',
    'Divida o preco total pela quantidade para encontrar o preco unitario e comparar.',
    'Preco por unidade (dividir total pela quantidade)',
    '/',
    107,
    'intermediate',
    'dia-a-dia'
  ),
  (
    'juros-simples',
    'Juros simples: quanto voce vai pagar?',
    'Aprenda a calcular juros simples com a formula J = C x i x t.',
    'J = C x i x t (formula de juros simples)',
    '*',
    108,
    'intermediate',
    'dia-a-dia'
  ),
  (
    'parcelamento',
    'Parcelamento: quanto voce realmente paga?',
    'Multiplique a parcela pelo numero de vezes para descobrir o total real.',
    'Total parcelado = parcela x numero de parcelas',
    '*',
    109,
    'intermediate',
    'dia-a-dia'
  ),
  -- Vestibulares (sort_order 200-299)
  (
    'multiplicar-por-11',
    'Multiplicar por 11',
    'Aprenda o truque para multiplicar qualquer numero por 11 rapidamente.',
    'Multiplicar por 11',
    '*',
    201,
    'intermediate',
    'vestibulares'
  ),
  (
    'quadrado-terminados-em-5',
    'Quadrado de numeros terminados em 5',
    'Calcule o quadrado de numeros terminados em 5 com um truque simples.',
    'Quadrado terminados em 5',
    '*',
    202,
    'intermediate',
    'vestibulares'
  ),
  (
    'multiplicar-proximos-100',
    'Multiplicar numeros proximos de 100',
    'Use a proximidade de 100 para multiplicar rapidamente.',
    'Multiplicar proximos de 100',
    '*',
    203,
    'advanced',
    'vestibulares'
  ),
  (
    'divisibilidade-rapida',
    'Divisibilidade rapida',
    'Descubra se um numero e divisivel por 2, 3, 4, 5, 6, 9 rapidamente.',
    'Divisibilidade rapida',
    '/',
    204,
    'intermediate',
    'vestibulares'
  ),
  (
    'estimativa-raiz-quadrada',
    'Estimativa de raiz quadrada',
    'Aprenda a estimar raizes quadradas sem calculadora.',
    'Estimativa de raiz quadrada',
    '/',
    205,
    'intermediate',
    'vestibulares'
  ),
  (
    'potencias-de-2-e-3',
    'Potencias de 2 e de 3',
    'Memorize e calcule rapidamente potencias de 2 e 3.',
    'Potencias de 2 e 3',
    '*',
    206,
    'intermediate',
    'vestibulares'
  )
on conflict (slug) do nothing;
