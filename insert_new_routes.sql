-- Script para inserir novas rotas conforme especificação
-- Execute este script no Supabase SQL Editor

-- 1. Verificar rotas existentes antes da inserção
SELECT 
    'ROTAS EXISTENTES ANTES' as status,
    COUNT(*) as total_rotas
FROM routes 
WHERE is_active = true;

-- 2. Inserir rotas de SAÍDA
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- Floresta - 5:30
('Floresta', 'Jaburu', '05:30', 10.00, 15, true),
('Floresta', 'Carnaubeira', '05:30', 15.00, 15, true),
('Floresta', 'Juazeiro Grande', '05:30', 20.00, 15, true),
('Floresta', 'Mirandiba', '05:30', 30.00, 15, true),

-- Jaburu - 6:00
('Jaburu', 'Carnaubeira', '06:00', 10.00, 15, true),
('Jaburu', 'Juazeiro Grande', '06:00', 15.00, 15, true),
('Jaburu', 'Mirandiba', '06:00', 20.00, 15, true),

-- Carnaubeira - 6:15
('Carnaubeira', 'Juazeiro Grande', '06:15', 20.00, 15, true),
('Carnaubeira', 'Mirandiba', '06:15', 20.00, 15, true),

-- Juazeiro Grande - 6:40
('Juazeiro Grande', 'Mirandiba', '06:40', 20.00, 15, true),

-- ROTAS DE RETORNO
-- Mirandiba - 12:00
('Mirandiba', 'Juazeiro Grande', '12:00', 20.00, 15, true),
('Mirandiba', 'Carnaubeira', '12:00', 20.00, 15, true),
('Mirandiba', 'Jaburu', '12:00', 20.00, 15, true),
('Mirandiba', 'Floresta', '12:00', 20.00, 15, true),

-- Juazeiro Grande - 12:15
('Juazeiro Grande', 'Carnaubeira', '12:15', 20.00, 15, true),
('Juazeiro Grande', 'Jaburu', '12:15', 20.00, 15, true),
('Juazeiro Grande', 'Floresta', '12:15', 20.00, 15, true),

-- Carnaubeira - 12:35
('Carnaubeira', 'Jaburu', '12:35', 20.00, 15, true),
('Carnaubeira', 'Floresta', '12:35', 20.00, 15, true),

-- Jaburu - 13:00
('Jaburu', 'Floresta', '13:00', 20.00, 15, true)

ON CONFLICT (origin, destination, departure_time, price) DO NOTHING;

-- 3. Verificar resultado após inserção
SELECT 
    'ROTAS APÓS INSERÇÃO' as status,
    COUNT(*) as total_rotas
FROM routes 
WHERE is_active = true;

-- 4. Mostrar todas as rotas organizadas por tipo e horário
SELECT 
    CASE 
        WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 'SAÍDA'
        ELSE 'RETORNO'
    END as tipo,
    origin,
    destination,
    departure_time,
    CONCAT('R$ ', price) as preco,
    capacity,
    'ATIVA' as status
FROM routes 
WHERE is_active = true
ORDER BY 
    CASE WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 1 ELSE 2 END,
    departure_time,
    origin,
    destination;

-- 5. Contar rotas por origem
SELECT 
    'DISTRIBUIÇÃO POR ORIGEM' as info,
    origin,
    COUNT(*) as total_rotas
FROM routes 
WHERE is_active = true
GROUP BY origin
ORDER BY 
    CASE origin 
        WHEN 'Floresta' THEN 1
        WHEN 'Jaburu' THEN 2
        WHEN 'Carnaubeira' THEN 3
        WHEN 'Juazeiro Grande' THEN 4
        WHEN 'Mirandiba' THEN 5
        ELSE 6
    END;
