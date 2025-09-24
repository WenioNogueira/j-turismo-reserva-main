-- Script para limpar duplicatas e inserir novas rotas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar rotas existentes
SELECT 
    'ANTES DA LIMPEZA' as status,
    COUNT(*) as total_rotas
FROM routes;

-- 2. Remover duplicatas (manter apenas a mais recente)
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY origin, destination, departure_time, price 
            ORDER BY created_at DESC
        ) as rn
    FROM routes 
    WHERE is_active = true
)
DELETE FROM routes 
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- 3. Desativar rotas antigas que conflitam com as novas
UPDATE routes 
SET is_active = false 
WHERE (origin, destination, departure_time) IN (
    -- Conflitos de horário com as novas rotas
    ('Floresta', 'Mirandiba', '05:40'),
    ('Jaburu', 'Mirandiba', '06:00'),
    ('Carnaubeira', 'Mirandiba', '06:15'),
    ('Juazeiro Grande', 'Mirandiba', '06:30'),
    ('Mirandiba', 'Floresta', '12:00'),
    ('Mirandiba', 'Juazeiro Grande', '12:15'),
    ('Mirandiba', 'Carnaubeira', '12:35'),
    ('Mirandiba', 'Jaburu', '13:00')
);

-- 4. Inserir as novas rotas
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- ROTAS DE SAÍDA
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

ON CONFLICT DO NOTHING;

-- 5. Verificar resultado final
SELECT 
    'RESULTADO FINAL' as status,
    COUNT(*) as total_rotas_ativas
FROM routes 
WHERE is_active = true;

-- 6. Mostrar todas as rotas ativas organizadas
SELECT 
    CASE 
        WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 'SAÍDA'
        ELSE 'RETORNO'
    END as tipo,
    origin,
    destination,
    departure_time,
    CONCAT('R$ ', price) as preco,
    capacity
FROM routes 
WHERE is_active = true
ORDER BY 
    CASE WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 1 ELSE 2 END,
    departure_time,
    origin,
    destination;
