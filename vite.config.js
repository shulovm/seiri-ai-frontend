import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ground.ink/ma/ で配信する場合は VITE_BASE_PATH=/ma/ でビルド
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    // Keep operations receipts and registered source artifacts behind the resolver.
    // Preserve Vite's default deny patterns while excluding this server-only bundle.
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/fixtures/human-interface/provenance/**'] },
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  preview: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
