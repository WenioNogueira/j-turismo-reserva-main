-- Script para inserir rotas detalhadas balanceadas
-- Execute este script no Supabase SQL Editor

-- 1. Limpar rotas existentes
DELETE FROM routes;

-- 2. Inserir rotas de SAÍDA (4 rotas principais)
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- SAÍDA - Rotas principais para Mirandiba
('Floresta', 'Mirandiba', '05:30', 30.00, 15, true),
('Jaburu', 'Mirandiba', '06:00', 20.00, 15, true),
('Carnaubeira', 'Mirandiba', '06:15', 20.00, 15, true),
('Juazeiro Grande', 'Mirandiba', '06:40', 20.00, 15, true);

-- 3. Inserir rotas de RETORNO (4 rotas principais)
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- RETORNO - Rotas principais de Mirandiba
('Mirandiba', 'Floresta', '12:00', 30.00, 15, true),
('Mirandiba', 'Jaburu', '12:00', 20.00, 15, true),
('Mirandiba', 'Carnaubeira', '12:00', 20.00, 15, true),
('Mirandiba', 'Juazeiro Grande', '12:00', 20.00, 15, true);

-- 4. Inserir rotas intermediárias de SAÍDA (opcionais)
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- Rotas intermediárias de saída
('Floresta', 'Jaburu', '05:30', 10.00, 15, true),
('Floresta', 'Carnaubeira', '05:30', 15.00, 15, true),
('Floresta', 'Juazeiro Grande', '05:30', 20.00, 15, true),
('Jaburu', 'Carnaubeira', '06:00', 10.00, 15, true),
('Jaburu', 'Juazeiro Grande', '06:00', 15.00, 15, true),
('Carnaubeira', 'Juazeiro Grande', '06:15', 20.00, 15, true);

-- 5. Inserir rotas intermediárias de RETORNO (opcionais)
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- Rotas intermediárias de retorno
('Juazeiro Grande', 'Carnaubeira', '12:15', 20.00, 15, true),
('Juazeiro Grande', 'Jaburu', '12:15', 20.00, 15, true),
('Juazeiro Grande', 'Floresta', '12:15', 20.00, 15, true),
('Carnaubeira', 'Jaburu', '12:35', 20.00, 15, true),
('Carnaubeira', 'Floresta', '12:35', 20.00, 15, true),
('Jaburu', 'Floresta', '13:00', 20.00, 15, true);

-- 6. Verificar resultado
SELECT 
    'ROTAS DETALHADAS' as status,
    COUNT(*) as total_rotas
FROM routes 
WHERE is_active = true;

-- 7. Mostrar distribuição balanceada
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
    origin;

-- 8. Contar por tipo
SELECT 
    'DISTRIBUIÇÃO DETALHADA' as info,
    CASE 
        WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 'SAÍDA'
        ELSE 'RETORNO'
    END as tipo,
    COUNT(*) as total_rotas
FROM routes 
WHERE is_active = true
GROUP BY 
    CASE 
        WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 'SAÍDA'
        ELSE 'RETORNO'
    END;
