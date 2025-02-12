import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true
  },
   build: {
    target: 'esnext', // Se der erro, altere para 'es2015'
    minify: 'esbuild',
    sourcemap: true
  }
})
 