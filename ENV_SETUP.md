# Configuração de Variáveis de Ambiente

## Para Desenvolvimento Local

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
VITE_SUPABASE_URL=https://tvcgtvrkegkmgutniejd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR1cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y2d0dnJrZWdrbWd1dG5pZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMjI4NjQsImV4cCI6MjA3Mzg5ODg2NH0.GAvSpvrlnwcsSdOi_UUsSoPUz7b89D8Gp8n7Ro46Fes
```

## Para Deploy no Vercel

Configure as seguintes variáveis de ambiente no painel do Vercel:

1. Acesse o projeto no Vercel
2. Vá em Settings > Environment Variables
3. Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL = https://tvcgtvrkegkmgutniejd.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR1cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y2d0dnJrZWdrbWd1dG5pZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMjI4NjQsImV4cCI6MjA3Mzg5ODg2NH0.GAvSpvrlnwcsSdOi_UUsSoPUz7b89D8Gp8n7Ro46Fes
```

## Verificação

Após configurar as variáveis, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

Se as variáveis estiverem configuradas corretamente, você não verá mensagens de erro no console.
