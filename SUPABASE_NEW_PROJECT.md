# 🚀 Criar Novo Projeto Supabase

## 📋 Passos para Resolver o Problema

### 1. Acesse o Supabase
- Vá para [supabase.com](https://supabase.com)
- Faça login na sua conta

### 2. Crie um Novo Projeto
- Clique em "New Project"
- Escolha uma organização
- Nome do projeto: `j-turismo-reserva`
- Senha do banco: `sua_senha_forte_aqui`
- Região: `South America (São Paulo)`

### 3. Obtenha as Chaves
Após criar o projeto, vá em **Settings > API** e copie:
- **Project URL**: `https://xxxxx.supabase.co`
- **anon public**: `eyJhbGciOiJIUzI1NiIsInR1cCI6IkpXVCJ9...`

### 4. Atualize o Arquivo .env
```env
VITE_SUPABASE_URL=https://sua_nova_url_aqui.supabase.co
VITE_SUPABASE_ANON_KEY=sua_nova_chave_aqui
```

### 5. Configure o Banco de Dados
Execute os scripts SQL que estão na pasta `supabase/migrations/` no novo projeto.

## 🔄 Alternativa Rápida
Se quiser, posso criar um projeto de teste temporário para você usar imediatamente.
