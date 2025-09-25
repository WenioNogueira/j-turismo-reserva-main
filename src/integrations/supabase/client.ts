import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configurações do Supabase - usando as chaves diretamente
const SUPABASE_URL = "https://tvcgtvrkegkmgutniejd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y2d0dnJrZWdrbWd1dG5pZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMjI4NjQsImV4cCI6MjA3Mzg5ODg2NH0.GAvSpvrlnwcsSdOi_UUsSoPUz7b89D8Gp8n7Ro46Fes";

// Debug: Verificar se as chaves estão sendo carregadas
console.log('🔍 Debug Supabase:');
console.log('URL:', SUPABASE_URL);
console.log('Key (primeiros 20 chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// Verificar se as chaves estão definidas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Chaves do Supabase não encontradas!');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Teste de conexão
console.log('🧪 Testando conexão com Supabase...');
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('❌ Erro ao conectar com Supabase:', error);
  } else {
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    console.log('📊 Sessão atual:', session ? 'Usuário logado' : 'Nenhum usuário logado');
  }
}).catch((error) => {
  console.error('❌ Erro crítico na conexão:', error);
});