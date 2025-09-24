-- Script para verificar status das rotas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar todas as rotas e seus status
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
ORDER BY is_active DESC, departure_time;

-- 2. Contar rotas por status
SELECT 
    is_active,
    COUNT(*) as total_rotas
FROM routes 
GROUP BY is_active;

-- 3. Verificar rotas que podem estar inativas incorretamente
SELECT 
    'ROTAS INATIVAS' as status,
    origin,
    destination,
    departure_time,
    price,
    created_at
FROM routes 
WHERE is_active = false
ORDER BY created_at DESC;

-- 4. Verificar se há rotas duplicadas com status diferentes
SELECT 
    origin,
    destination,
    departure_time,
    price,
    COUNT(*) as total,
    STRING_AGG(is_active::text, ', ') as status_list,
    STRING_AGG(id::text, ', ') as route_ids
FROM routes 
GROUP BY origin, destination, departure_time, price
HAVING COUNT(*) > 1
ORDER BY total DESC;
