-- Script para criar usuário administrador no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Criar usuário na tabela auth.users (isso deve ser feito via Supabase Auth)
-- Você pode criar o usuário através da interface do Supabase ou usar a API

-- 2. Inserir perfil do administrador na tabela profiles
-- Substitua 'USER_ID_AQUI' pelo ID do usuário criado no auth.users

-- Primeiro, vamos verificar se já existe um usuário admin
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Verificar se já existe um usuário admin
    SELECT user_id INTO admin_user_id 
    FROM public.profiles 
    WHERE role = 'admin' 
    LIMIT 1;
    
    IF admin_user_id IS NULL THEN
        -- Se não existe, vamos criar um usuário temporário
        -- NOTA: Para criar usuário real, use a interface do Supabase Auth
        RAISE NOTICE 'Nenhum usuário admin encontrado.';
        RAISE NOTICE 'Para criar um usuário admin:';
        RAISE NOTICE '1. Vá para Authentication > Users no Supabase Dashboard';
        RAISE NOTICE '2. Clique em "Add user"';
        RAISE NOTICE '3. Use email: admin@jturismo.com';
        RAISE NOTICE '4. Use senha: Admin123!';
        RAISE NOTICE '5. Execute este script novamente com o ID do usuário';
    ELSE
        RAISE NOTICE 'Usuário admin já existe com ID: %', admin_user_id;
    END IF;
END $$;

-- Função para inserir perfil do admin (execute após criar o usuário)
CREATE OR REPLACE FUNCTION create_admin_profile(user_email TEXT, user_password TEXT)
RETURNS TEXT AS $$
DECLARE
    new_user_id UUID;
    profile_id UUID;
BEGIN
    -- Verificar se o usuário já existe
    SELECT id INTO new_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF new_user_id IS NULL THEN
        RETURN 'Usuário não encontrado. Crie o usuário primeiro no Supabase Auth.';
    END IF;
    
    -- Verificar se já tem perfil
    SELECT id INTO profile_id 
    FROM public.profiles 
    WHERE user_id = new_user_id;
    
    IF profile_id IS NOT NULL THEN
        RETURN 'Usuário já possui perfil admin.';
    END IF;
    
    -- Criar perfil admin
    INSERT INTO public.profiles (user_id, role)
    VALUES (new_user_id, 'admin');
    
    RETURN 'Perfil admin criado com sucesso para: ' || user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Instruções para uso:
-- 1. Crie o usuário no Supabase Auth Dashboard
-- 2. Execute: SELECT create_admin_profile('admin@jturismo.com', 'Admin123!');
