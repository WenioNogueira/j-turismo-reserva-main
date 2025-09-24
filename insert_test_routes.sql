-- Script para inserir rotas de teste
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se há rotas existentes
SELECT 
    'ROTAS EXISTENTES' as status,
    COUNT(*) as total
FROM routes;

-- 2. Inserir rotas de teste se não houver nenhuma
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- ROTAS DE SAÍDA
('Floresta', 'Mirandiba', '05:40', 30.00, 15, true),
('Jaburu', 'Mirandiba', '06:00', 25.00, 15, true),
('Carnaubeira', 'Mirandiba', '06:15', 20.00, 15, true),
('Juazeiro Grande', 'Mirandiba', '06:30', 15.00, 15, true),

-- ROTAS DE RETORNO
('Mirandiba', 'Floresta', '12:00', 30.00, 15, true),
('Mirandiba', 'Juazeiro Grande', '12:15', 25.00, 15, true),
('Mirandiba', 'Carnaubeira', '12:35', 20.00, 15, true),
('Mirandiba', 'Jaburu', '13:00', 15.00, 15, true)
ON CONFLICT DO NOTHING;

-- 3. Verificar resultado
SELECT 
    'APÓS INSERÇÃO' as status,
    COUNT(*) as total_rotas
FROM routes 
WHERE is_active = true;

-- 4. Mostrar todas as rotas inseridas
SELECT 
    id,
    origin,
    destination,
    departure_time,
    price,
    capacity,
    is_active
FROM routes 
WHERE is_active = true
ORDER BY departure_time;
