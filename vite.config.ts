import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Plumber-project/', // ⬅️ use your repo name here
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
