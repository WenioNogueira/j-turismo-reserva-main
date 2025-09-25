# Solução de Problemas - Erro nas Credenciais

## 🔍 **Passos para Resolver:**

### **1. Verificar se o Usuário Existe no Banco**
Execute este SQL no Supabase Dashboard (SQL Editor):

```sql
-- Verificar usuários existentes
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email = 'admin@jturismo.com';
```

### **2. Se o Usuário NÃO Existe - Criar Usuário**
Execute este SQL no Supabase Dashboard:

```sql
-- Criar usuário admin
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@jturismo.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    now(),
    now()
);

-- Criar perfil admin
INSERT INTO public.profiles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'admin@jturismo.com';
```

### **3. Se o Usuário Existe - Verificar Status**
Execute este SQL:

```sql
-- Verificar status do usuário
SELECT 
    u.email,
    u.email_confirmed_at,
    u.last_sign_in_at,
    p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'admin@jturismo.com';
```

### **4. Testar Login com Debug**
1. Acesse `http://localhost:5173`
2. Abra o Console (F12)
3. Tente fazer login com:
   - **Email**: `admin@jturismo.com`
   - **Senha**: `Admin123!`
4. Verifique os logs no console

### **5. Possíveis Erros e Soluções**

#### **Erro: "Invalid login credentials"**
- **Causa**: Email ou senha incorretos
- **Solução**: Verificar se o usuário existe e a senha está correta

#### **Erro: "Email not confirmed"**
- **Causa**: Email não foi confirmado
- **Solução**: Executar SQL para confirmar email:
```sql
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'admin@jturismo.com';
```

#### **Erro: "User not found"**
- **Causa**: Usuário não existe no banco
- **Solução**: Criar usuário com o SQL acima

#### **Erro: "Invalid API key"**
- **Causa**: Chaves do Supabase incorretas
- **Solução**: Verificar se as chaves estão corretas no `client.ts`

### **6. Verificar Configurações do Supabase**

1. **Authentication Settings:**
   - Vá para Authentication > Settings
   - Verifique se "Enable email confirmations" está desabilitado (para teste)
   - Ou habilite e confirme o email

2. **RLS Policies:**
   - Verifique se as políticas RLS estão corretas
   - Execute o script `debug_auth_issue.sql`

### **7. Credenciais de Teste Alternativas**

Se ainda não funcionar, tente criar um usuário com email diferente:

```sql
-- Usuário alternativo
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'teste@admin.com',
    crypt('123456', gen_salt('bf')),
    now(),
    now(),
    now()
);

INSERT INTO public.profiles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'teste@admin.com';
```

**Credenciais alternativas:**
- **Email**: `teste@admin.com`
- **Senha**: `123456`

## 📞 **Se Ainda Não Funcionar**

Me envie:
1. O erro exato que aparece no console
2. O resultado do SQL de verificação de usuários
3. Screenshot da tela de erro
