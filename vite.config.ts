import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: 'es2015', // Better compatibility with older browsers
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Ensure better compatibility
        format: 'es',
      },
    },
  },
  base: "/",
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js']
  },
  // Add polyfills for better mobile compatibility
  esbuild: {
    target: 'es2015',
    supported: {
      'top-level-await': false
    }
  }
});
