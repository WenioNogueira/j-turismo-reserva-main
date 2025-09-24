-- Script para verificar e corrigir políticas RLS
-- Execute este script no Supabase SQL Editor

-- 1. Verificar políticas RLS atuais na tabela routes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'routes';

-- 2. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'routes';

-- 3. Remover políticas existentes e recriar
DROP POLICY IF EXISTS "Anyone can view active routes" ON public.routes;
DROP POLICY IF EXISTS "Only authenticated users can manage routes" ON public.routes;

-- 4. Criar política mais permissiva para visualização
CREATE POLICY "Public can view active routes" 
ON public.routes 
FOR SELECT 
USING (is_active = true);

-- 5. Criar política para usuários autenticados gerenciarem rotas
CREATE POLICY "Authenticated users can manage routes" 
ON public.routes 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- 6. Verificar se a política foi criada
SELECT 
    'POLÍTICAS CRIADAS' as status,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'routes';

-- 7. Testar consulta pública
SELECT 
    'TESTE CONSULTA PÚBLICA' as status,
    COUNT(*) as total_rotas_visiveis
FROM routes 
WHERE is_active = true;
