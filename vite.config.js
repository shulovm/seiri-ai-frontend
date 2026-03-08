import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ground.ink/ma/ で配信する場合は VITE_BASE_PATH=/ma/ でビルド
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
