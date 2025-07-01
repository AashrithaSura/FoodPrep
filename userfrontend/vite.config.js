import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Your backend server
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  build: {
    assetsInclude: ['**/*.png', '**/*.jpg'],
  },
  preview: {
    port: 4173, // Explicitly set preview port
    cors: true // Enable CORS for preview server
  }
})