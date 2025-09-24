-- Script para ativar todas as rotas que deveriam estar ativas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar rotas inativas antes da correção
SELECT 
    'ANTES DA CORREÇÃO' as status,
    COUNT(*) as total_rotas_inativas
FROM routes 
WHERE is_active = false;

-- 2. Ativar todas as rotas (assumindo que todas deveriam estar ativas)
UPDATE routes 
SET is_active = true 
WHERE is_active = false;

-- 3. Verificar resultado
SELECT 
    'APÓS A CORREÇÃO' as status,
    COUNT(*) as total_rotas_ativas
FROM routes 
WHERE is_active = true;

-- 4. Mostrar todas as rotas ativas organizadas
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
