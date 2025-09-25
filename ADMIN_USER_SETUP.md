# Como Criar Usuário Administrador no Supabase

## Método 1: Via Interface do Supabase (Recomendado)

### Passo 1: Acesse o Supabase Dashboard
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione o projeto `tvcgtvrkegkmgutniejd`

### Passo 2: Criar Usuário
1. No menu lateral, clique em **Authentication**
2. Clique em **Users**
3. Clique no botão **Add user**
4. Preencha os dados:
   - **Email**: `admin@jturismo.com`
   - **Password**: `Admin123!`
   - **Confirm Password**: `Admin123!`
5. Clique em **Create user**

### Passo 3: Executar SQL para Criar Perfil
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query**
3. Cole o seguinte código SQL:

```sql
-- Criar perfil admin para o usuário criado
INSERT INTO public.profiles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'admin@jturismo.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

4. Clique em **Run** para executar

## Método 2: Via SQL Direto

Se preferir criar tudo via SQL, execute este código no SQL Editor:

```sql
-- 1. Criar usuário (isso pode não funcionar dependendo das configurações)
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
);

-- 2. Criar perfil admin
INSERT INTO public.profiles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'admin@jturismo.com';
```

## Testando o Login

Após criar o usuário:

1. Acesse `http://localhost:5173`
2. Vá para o login do admin
3. Use as credenciais:
   - **Email**: `admin@jturismo.com`
   - **Senha**: `Admin123!`

## Credenciais de Teste

- **Email**: `admin@jturismo.com`
- **Senha**: `Admin123!`
- **Role**: `admin`

## Solução de Problemas

Se der erro ao criar o usuário:
1. Verifique se o projeto Supabase está ativo
2. Verifique se as políticas RLS estão configuradas corretamente
3. Tente criar o usuário via interface primeiro, depois execute o SQL do perfil
