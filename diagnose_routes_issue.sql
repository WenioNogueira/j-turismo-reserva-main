-- Script de diagnóstico completo para problema das rotas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela routes existe
SELECT 
    'TABELA ROUTES' as verificação,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'routes') 
        THEN 'EXISTE' 
        ELSE 'NÃO EXISTE' 
    END as status;

-- 2. Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'routes' 
ORDER BY ordinal_position;

-- 3. Contar total de registros
SELECT 
    'TOTAL DE REGISTROS' as verificação,
    COUNT(*) as total
FROM routes;

-- 4. Contar rotas ativas
SELECT 
    'ROTAS ATIVAS' as verificação,
    COUNT(*) as total
FROM routes 
WHERE is_active = true;

-- 5. Mostrar todas as rotas com status
SELECT 
    'TODAS AS ROTAS' as verificação,
    id,
    origin,
    destination,
    departure_time,
    price,
    is_active,
    created_at
FROM routes 
ORDER BY is_active DESC, departure_time;

-- 6. Verificar políticas RLS
SELECT 
    'POLÍTICAS RLS' as verificação,
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'routes';

-- 7. Verificar se RLS está habilitado
SELECT 
    'RLS HABILITADO' as verificação,
    rowsecurity as rls_habilitado
FROM pg_tables 
WHERE tablename = 'routes';

-- 8. Testar consulta exata do frontend
SELECT 
    'CONSULTA FRONTEND' as verificação,
    *
FROM routes 
WHERE is_active = true
ORDER BY departure_time;
