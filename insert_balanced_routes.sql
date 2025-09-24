-- Script para inserir rotas balanceadas (ida e volta iguais)
-- Execute este script no Supabase SQL Editor

-- 1. Limpar rotas existentes
DELETE FROM routes;

-- 2. Inserir rotas balanceadas de SAÍDA (todas vão para Mirandiba)
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- SAÍDA - Todas as cidades vão para Mirandiba
('Floresta', 'Mirandiba', '05:30', 30.00, 15, true),
('Jaburu', 'Mirandiba', '06:00', 20.00, 15, true),
('Carnaubeira', 'Mirandiba', '06:15', 20.00, 15, true),
('Juazeiro Grande', 'Mirandiba', '06:40', 20.00, 15, true);

-- 3. Inserir rotas balanceadas de RETORNO (todas saem de Mirandiba)
INSERT INTO public.routes (origin, destination, departure_time, price, capacity, is_active) VALUES
-- RETORNO - Todas saem de Mirandiba
('Mirandiba', 'Floresta', '12:00', 30.00, 15, true),
('Mirandiba', 'Jaburu', '12:00', 20.00, 15, true),
('Mirandiba', 'Carnaubeira', '12:00', 20.00, 15, true),
('Mirandiba', 'Juazeiro Grande', '12:00', 20.00, 15, true);

-- 4. Verificar resultado
SELECT 
    'ROTAS BALANCEADAS' as status,
    COUNT(*) as total_rotas
FROM routes 
WHERE is_active = true;

-- 5. Mostrar distribuição
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

-- 6. Contar por tipo
SELECT 
    'DISTRIBUIÇÃO BALANCEADA' as info,
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
