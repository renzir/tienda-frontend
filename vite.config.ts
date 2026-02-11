import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    server: {
    proxy: {
      // Cada vez que hagas un fetch a '/api', Vite lo mandará al backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Quita el '/api' antes de enviarlo
      }
    }
  }
})
