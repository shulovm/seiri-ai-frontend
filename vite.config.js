import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'redirect-root-to-ma',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            res.statusCode = 302
            res.setHeader('Location', '/ma/')
            res.end()
            return
          }
          next()
        })
      },
    },
  ],
  base: '/ma/',
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
