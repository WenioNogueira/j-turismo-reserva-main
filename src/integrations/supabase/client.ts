import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://tvcgtvrkegkmgutniejd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y2d0dnJrZWdrbWd1dG5pZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMjI4NjQsImV4cCI6MjA3Mzg5ODg2NH0.GAvSpvrlnwcsSdOi_UUsSoPUz7b89D8Gp8n7Ro46Fes";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});