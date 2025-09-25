# J Turismo - Sistema de Reservas

Sistema de reservas de passagens para J Turismo, desenvolvido com React, TypeScript e Supabase.

## Tecnologias Utilizadas

- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Supabase** - Backend e banco de dados
- **React Router** - Roteamento
- **date-fns** - Manipulação de datas

## Funcionalidades

- ✅ Sistema de autenticação seguro
- ✅ Reservas de passagens (Ida, Volta, Ida e Volta)
- ✅ Dashboard administrativo completo
- ✅ Histórico de reservas
- ✅ Integração com WhatsApp
- ✅ Interface responsiva para mobile
- ✅ Sistema de protocolos automáticos
- ✅ Validação de datas corrigida

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   ```
4. Execute o projeto:
   ```bash
   npm run dev
   ```

## Deploy

O projeto está configurado para deploy no Vercel com as configurações necessárias.

## Documentação

- `ADMIN_USER_SETUP.md` - Como criar usuário administrador
- `AUTH_TROUBLESHOOTING.md` - Solução de problemas de login
- `DATE_FIX.md` - Correção de problemas de data
- `MOBILE_DEBUG.md` - Debug para dispositivos móveis
- `SECURITY_CHANGES.md` - Mudanças de segurança implementadas
