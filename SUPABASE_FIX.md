# 🔧 Correção do Erro "Chave API Inválida"

## 🚨 Problema Identificado
O erro "Chave API Inválida" indica que as credenciais do Supabase não estão corretas ou o projeto foi desativado.

## 🔍 Diagnóstico
1. **Verifique o console do navegador** - deve mostrar:
   ```
   🔍 Debug Supabase:
   URL: https://tvcgtvrkegkmgutniejd.supabase.co
   Key (primeiros 20 chars): eyJhbGciOiJIUzI1NiIsInR1cCI6IkpXVCJ9...
   ```

2. **Se aparecer "undefined"** - as variáveis de ambiente não estão carregando

## 🛠️ Soluções

### Solução 1: Verificar Projeto Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Verifique se o projeto `tvcgtvrkegkmgutniejd` ainda existe
4. Se não existir, crie um novo projeto

### Solução 2: Obter Novas Chaves
1. No painel do Supabase, vá em **Settings > API**
2. Copie a **Project URL** e **anon public** key
3. Atualize o arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=sua_nova_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_nova_chave_aqui
   ```

### Solução 3: Usar Projeto de Teste
Se não tiver acesso ao Supabase, posso criar um projeto de teste temporário.

## 🔄 Próximos Passos
1. **Reinicie o servidor**: `npm run dev`
2. **Verifique o console** para mensagens de debug
3. **Teste a conexão** tentando fazer login

## 📞 Suporte
Se o problema persistir, forneça:
- Screenshot do console do navegador
- Status do projeto no Supabase
- Mensagens de erro específicas
