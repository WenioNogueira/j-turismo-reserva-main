-- Script para corrigir rotas que não aparecem para o usuário
-- Execute este script no Supabase SQL Editor

-- 1. Verificar status atual das rotas
SELECT 
    'STATUS ATUAL' as info,
    is_active,
    COUNT(*) as total
FROM routes 
GROUP BY is_active;

-- 2. Mostrar todas as rotas com seus status
SELECT 
    id,
    origin,
    destination,
    departure_time,
    price,
    is_active,
    created_at
FROM routes 
ORDER BY is_active DESC, departure_time;

-- 3. Ativar todas as rotas que estão inativas (assumindo que todas deveriam estar ativas)
UPDATE routes 
SET is_active = true 
WHERE is_active = false;

-- 4. Verificar se há rotas duplicadas e remover as mais antigas
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

-- 5. Verificar resultado final
SELECT 
    'RESULTADO FINAL' as info,
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
    capacity,
    'ATIVA' as status
FROM routes 
WHERE is_active = true
ORDER BY 
    CASE WHEN origin IN ('Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande') THEN 1 ELSE 2 END,
    departure_time;
