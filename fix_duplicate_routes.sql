-- Script para corrigir rotas duplicadas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar rotas duplicadas
SELECT 
    origin, 
    destination, 
    departure_time, 
    price,
    COUNT(*) as duplicate_count
FROM public.routes 
WHERE is_active = true
GROUP BY origin, destination, departure_time, price
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 2. Mostrar todas as rotas ativas atuais
SELECT 
    id,
    origin, 
    destination, 
    departure_time, 
    price,
    capacity,
    created_at
FROM public.routes 
WHERE is_active = true
ORDER BY origin, destination, departure_time;

-- 3. Remover rotas duplicadas (manter apenas a mais recente)
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

-- 4. Verificar resultado após limpeza
SELECT 
    'ROTAS APÓS LIMPEZA' as status,
    COUNT(*) as total_rotas 
FROM routes 
WHERE is_active = true;

-- 5. Mostrar rotas finais organizadas
SELECT 
    CASE 
        WHEN origin = 'Floresta' THEN 'SAÍDA'
        WHEN origin = 'Jaburu' THEN 'SAÍDA'
        WHEN origin = 'Carnaubeira' THEN 'SAÍDA'
        WHEN origin = 'Juazeiro Grande' THEN 'SAÍDA'
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
