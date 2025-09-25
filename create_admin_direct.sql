-- Script para criar usuário admin diretamente
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. Criar usuário na tabela auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@jturismo.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- 2. Criar perfil admin
INSERT INTO public.profiles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'admin@jturismo.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- 3. Verificar se foi criado
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.role,
    'Usuário criado com sucesso!' as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@jturismo.com';
