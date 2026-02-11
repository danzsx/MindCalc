-- =============================================
-- Seed — 8 aulas iniciais do MindCalc
-- Executar apos a migration 001_lessons_tables.sql
-- =============================================

insert into public.lessons (slug, title, description, technique, operator, sort_order, difficulty)
values
  (
    'somar-dezenas-primeiro',
    'Somar dezenas primeiro',
    'Aprenda a somar separando as dezenas para facilitar o calculo.',
    'Somar dezenas primeiro',
    '+',
    1,
    'beginner'
  ),
  (
    'somar-arredondando',
    'Somar arredondando para 10',
    'Arredonde um dos numeros para a dezena mais proxima e depois ajuste.',
    'Somar arredondando para 10',
    '+',
    2,
    'beginner'
  ),
  (
    'subtrair-completando',
    'Subtrair completando a dezena',
    'Complete a dezena para subtrair de forma mais simples.',
    'Subtrair completando a dezena',
    '-',
    3,
    'beginner'
  ),
  (
    'subtrair-por-partes',
    'Subtrair por partes',
    'Quebre a subtracao em partes menores para calcular mais facil.',
    'Subtrair por partes',
    '-',
    4,
    'beginner'
  ),
  (
    'multiplicar-por-5',
    'Multiplicar por 5 (metade de 10x)',
    'Multiplique por 10 e divida por 2 — muito mais rapido!',
    'Multiplicar por 5 (metade de 10x)',
    '*',
    5,
    'intermediate'
  ),
  (
    'multiplicar-por-9',
    'Multiplicar por 9 (10x - 1x)',
    'Multiplique por 10 e subtraia o numero original.',
    'Multiplicar por 9 (10x - 1x)',
    '*',
    6,
    'intermediate'
  ),
  (
    'dividir-por-2-e-4',
    'Dividir por 2 e por 4 (metade da metade)',
    'Divida por 2 duas vezes para dividir por 4 facilmente.',
    'Dividir por 2 e por 4 (metade da metade)',
    '/',
    7,
    'intermediate'
  ),
  (
    'dividir-pensando-na-multiplicacao',
    'Dividir pensando na multiplicacao',
    'Transforme a divisao em uma pergunta de multiplicacao.',
    'Dividir pensando na multiplicacao',
    '/',
    8,
    'intermediate'
  ),
  (
    'porcentagem-10',
    'Porcentagem: o jeito facil de calcular 10%',
    'Aprenda a calcular 10% de qualquer valor dividindo por 10.',
    'Porcentagem 10%',
    '/',
    101,
    'beginner'
  ),
  (
    'porcentagem-quanto-e',
    'Porcentagem: encontrar quanto % e um valor',
    'Descubra que porcentagem um valor representa de outro usando parte x 100.',
    'Porcentagem - encontrar percentual',
    '/',
    102,
    'beginner'
  ),
  (
    'fracao-metade-terco-quarto',
    'Fracao: entendendo metade, um terco e um quarto',
    'Fracoes do jeito simples: dividir em partes iguais.',
    'Fracoes basicas',
    '/',
    103,
    'beginner'
  ),
  (
    'fracao-somar-subtrair',
    'Fracao: somar e subtrair fracoes simples',
    'Aprenda a somar fracoes encontrando cada parte e depois somando.',
    'Fracoes - somar e subtrair',
    '+',
    104,
    'beginner'
  ),
  (
    'regra-de-3-proporcao',
    'Regra de 3: resolver problemas de proporcao',
    'Use valor unitario e multiplique pela nova quantidade.',
    'Regra de 3 direta',
    '*',
    105,
    'intermediate'
  ),
  (
    'regra-de-3-inversa',
    'Regra de 3: problemas inversos',
    'Quando um valor aumenta, o outro diminui. Pense no trabalho total.',
    'Regra de 3 inversa',
    '/',
    106,
    'intermediate'
  )
on conflict (slug) do nothing;
