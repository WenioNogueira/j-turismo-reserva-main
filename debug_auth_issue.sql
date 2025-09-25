-- Script para debugar problemas de autenticação
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. Verificar se existem usuários na tabela auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Verificar se existem perfis na tabela profiles
SELECT 
    p.id as profile_id,
    p.user_id,
    p.role,
    u.email
FROM public.profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- 3. Verificar se o usuário admin existe
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@jturismo.com';

-- 4. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('profiles', 'reservations', 'routes');

-- 5. Verificar se o usuário pode fazer login
SELECT 
    u.email,
    u.email_confirmed_at,
    u.last_sign_in_at,
    u.encrypted_password IS NOT NULL as has_password
FROM auth.users u
WHERE u.email = 'admin@jturismo.com';
