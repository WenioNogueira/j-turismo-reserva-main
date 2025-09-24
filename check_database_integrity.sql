-- Script para verificar integridade do banco de dados
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estrutura da tabela routes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'routes' 
ORDER BY ordinal_position;

-- 2. Verificar se há constraints únicos
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'routes'
ORDER BY tc.constraint_name;

-- 3. Verificar índices na tabela routes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'routes';

-- 4. Contar total de rotas por status
SELECT 
    is_active,
    COUNT(*) as total
FROM routes 
GROUP BY is_active;

-- 5. Verificar rotas duplicadas por critérios específicos
SELECT 
    origin, 
    destination, 
    departure_time, 
    price,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as route_ids
FROM routes 
WHERE is_active = true
GROUP BY origin, destination, departure_time, price
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 6. Verificar se há rotas com dados inconsistentes
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
ORDER BY origin, destination, departure_time;
