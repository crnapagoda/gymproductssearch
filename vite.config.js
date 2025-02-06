import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  define: {
    'process.env.SUPABASE_KEY': JSON.stringify(process.env.SUPABASE_KEY)
  },
  build: {
    outDir: 'dist',
  },
});
