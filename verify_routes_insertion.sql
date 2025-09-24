-- Script para verificar quais rotas serão inseridas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar rotas existentes que conflitam
SELECT 
    'CONFLITOS EXISTENTES' as status,
    origin,
    destination,
    departure_time,
    price,
    'JÁ EXISTE' as situacao
FROM routes 
WHERE is_active = true
AND (origin, destination, departure_time) IN (
    ('Floresta', 'Jaburu', '05:30'),
    ('Floresta', 'Carnaubeira', '05:30'),
    ('Floresta', 'Juazeiro Grande', '05:30'),
    ('Floresta', 'Mirandiba', '05:30'),
    ('Jaburu', 'Carnaubeira', '06:00'),
    ('Jaburu', 'Juazeiro Grande', '06:00'),
    ('Jaburu', 'Mirandiba', '06:00'),
    ('Carnaubeira', 'Juazeiro Grande', '06:15'),
    ('Carnaubeira', 'Mirandiba', '06:15'),
    ('Juazeiro Grande', 'Mirandiba', '06:40'),
    ('Mirandiba', 'Juazeiro Grande', '12:00'),
    ('Mirandiba', 'Carnaubeira', '12:00'),
    ('Mirandiba', 'Jaburu', '12:00'),
    ('Mirandiba', 'Floresta', '12:00'),
    ('Juazeiro Grande', 'Carnaubeira', '12:15'),
    ('Juazeiro Grande', 'Jaburu', '12:15'),
    ('Juazeiro Grande', 'Floresta', '12:15'),
    ('Carnaubeira', 'Jaburu', '12:35'),
    ('Carnaubeira', 'Floresta', '12:35'),
    ('Jaburu', 'Floresta', '13:00')
);

-- 2. Mostrar todas as rotas atuais
SELECT 
    'ROTAS ATUAIS' as status,
    origin,
    destination,
    departure_time,
    CONCAT('R$ ', price) as preco,
    'ATIVA' as situacao
FROM routes 
WHERE is_active = true
ORDER BY 
    CASE WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 1 ELSE 2 END,
    departure_time,
    origin;

-- 3. Contar rotas por origem
SELECT 
    'DISTRIBUIÇÃO ATUAL' as info,
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
