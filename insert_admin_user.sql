-- Script SQL para criar usuário administrador
-- Execute este código no SQL Editor do Supabase Dashboard

-- Verificar se já existe usuário admin
DO $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count
    FROM public.profiles 
    WHERE role = 'admin';
    
    IF admin_count = 0 THEN
        RAISE NOTICE 'Nenhum usuário admin encontrado.';
        RAISE NOTICE 'Execute os passos abaixo:';
        RAISE NOTICE '1. Vá para Authentication > Users no Supabase Dashboard';
        RAISE NOTICE '2. Clique em "Add user"';
        RAISE NOTICE '3. Email: admin@jturismo.com';
        RAISE NOTICE '4. Senha: Admin123!';
        RAISE NOTICE '5. Execute o código abaixo após criar o usuário';
    ELSE
        RAISE NOTICE 'Usuário admin já existe.';
    END IF;
END $$;

-- Após criar o usuário via interface, execute este código:
-- (Descomente as linhas abaixo após criar o usuário)

/*
-- Criar perfil admin para o usuário
INSERT INTO public.profiles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'admin@jturismo.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verificar se foi criado
SELECT 
    p.id as profile_id,
    p.role,
    u.email,
    u.created_at
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.role = 'admin';
*/
