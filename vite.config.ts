import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ['**/swagat-backend-main/**', '**/.git/**', '**/node_modules/**', '**/*.sql', '**/*.md', '**/*.yaml']
    },
    proxy: {
      '/healthz': {
        target: 'https://swagat-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://swagat-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'https://swagat-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/apply': {
        target: 'https://swagat-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/dept': {
        target: 'https://swagat-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  }
});
