-- Script para adicionar constraint única e prevenir duplicatas
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, limpar duplicatas existentes
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY origin, destination, departure_time, price 
            ORDER BY created_at DESC
        ) as rn
    FROM public.routes 
    WHERE is_active = true
)
DELETE FROM public.routes 
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- 2. Adicionar constraint única para prevenir duplicatas futuras
-- (Comentado por enquanto para evitar conflitos com dados existentes)
-- ALTER TABLE public.routes 
-- ADD CONSTRAINT unique_route_combination 
-- UNIQUE (origin, destination, departure_time, price);

-- 3. Verificar resultado
SELECT 
    'ROTAS APÓS LIMPEZA' as status,
    COUNT(*) as total_rotas 
FROM routes 
WHERE is_active = true;

-- 4. Mostrar rotas organizadas
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
    departure_time;
