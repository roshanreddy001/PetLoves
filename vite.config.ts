import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from the parent directory where the actual src/ lives
      allow: [path.resolve(__dirname, '..')],
    },
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      // Add any path aliases you need here
      '@': path.resolve(__dirname, './src'),
    },
  },
});