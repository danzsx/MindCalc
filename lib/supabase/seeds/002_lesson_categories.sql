-- =============================================
-- Migration: Add category column and vestibulares lessons
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Add category column
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS category text DEFAULT 'basicas';

-- 2. Categorize existing lessons by sort_order
UPDATE public.lessons SET category = 'basicas' WHERE sort_order < 100;
UPDATE public.lessons SET category = 'dia-a-dia' WHERE sort_order >= 100 AND sort_order < 200;

-- 3. Insert "dia-a-dia" lessons (in case they don't exist yet)
INSERT INTO public.lessons (slug, title, description, technique, operator, sort_order, difficulty, category)
VALUES
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
  )
ON CONFLICT (slug) DO UPDATE SET category = EXCLUDED.category;

-- 4. Insert 6 new "vestibulares" lessons
INSERT INTO public.lessons (slug, title, description, technique, operator, sort_order, difficulty, category)
VALUES
  (
    'multiplicar-por-11',
    'Multiplicar por 11 em segundos',
    'Multiplique qualquer numero de 2 digitos por 11 instantaneamente.',
    'Multiplicar por 11 - digitos somam o meio',
    '*',
    201,
    'intermediate',
    'vestibulares'
  ),
  (
    'quadrado-terminados-em-5',
    'Quadrado de numeros terminados em 5',
    'Calcule o quadrado de 15, 25, 35... sem esforco.',
    'Quadrado terminados em 5 - n*(n+1)|25',
    '*',
    202,
    'intermediate',
    'vestibulares'
  ),
  (
    'multiplicar-proximos-100',
    'Multiplicar numeros proximos de 100',
    'Use complementos para multiplicar 97x96, 98x95 e similares.',
    'Complementos de 100',
    '*',
    203,
    'advanced',
    'vestibulares'
  ),
  (
    'divisibilidade-rapida',
    'Divisibilidade rapida',
    'Descubra se um numero e divisivel por 2, 3, 4, 5, 6 ou 9 sem dividir.',
    'Regras de divisibilidade',
    '/',
    204,
    'intermediate',
    'vestibulares'
  ),
  (
    'estimativa-raiz-quadrada',
    'Estimativa de raiz quadrada',
    'Encontre entre quais inteiros esta a raiz quadrada de qualquer numero.',
    'Estimativa de raiz quadrada',
    '/',
    205,
    'intermediate',
    'vestibulares'
  ),
  (
    'potencias-de-2-e-3',
    'Potencias de 2 e 3 de cor',
    'Memorize as potencias mais cobradas em provas de forma estrategica.',
    'Memorizacao de potencias',
    '*',
    206,
    'intermediate',
    'vestibulares'
  )
ON CONFLICT (slug) DO NOTHING;
