-- Script para testar a consulta de rotas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela routes existe e tem dados
SELECT 
    'VERIFICAÇÃO INICIAL' as teste,
    COUNT(*) as total_rotas
FROM routes;

-- 2. Verificar rotas ativas (mesma consulta do UserDashboard)
SELECT 
    'ROTAS ATIVAS' as teste,
    COUNT(*) as total_ativas
FROM routes 
WHERE is_active = true;

-- 3. Mostrar todas as rotas ativas com detalhes
SELECT 
    id,
    origin,
    destination,
    departure_time,
    price,
    capacity,
    is_active,
    created_at
FROM routes 
WHERE is_active = true
ORDER BY departure_time;

-- 4. Verificar se há problemas de permissão RLS
SELECT 
    'VERIFICAÇÃO RLS' as teste,
    COUNT(*) as total_visiveis
FROM routes 
WHERE is_active = true;

-- 5. Testar a consulta exata do frontend
SELECT 
    'CONSULTA FRONTEND' as teste,
    *
FROM routes 
WHERE is_active = true
ORDER BY departure_time;
