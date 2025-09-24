import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configurações do Supabase com fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://tvcgtvrkegkmgutniejd.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR1cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y2d0dnJrZWdrbWd1dG5pZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMjI4NjQsImV4cCI6MjA3Mzg5ODg2NH0.GAvSpvrlnwcsSdOi_UUsSoPUz7b89D8Gp8n7Ro46Fes";

// Verificar se as variáveis estão definidas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.log('🔧 Configure as seguintes variáveis:');
  console.log('VITE_SUPABASE_URL=https://tvcgtvrkegkmgutniejd.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR1cCI6IkpXVCJ9...');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});