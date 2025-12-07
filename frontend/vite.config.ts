import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
  server: {
    fs: {
      strict: true,
      allow: [path.resolve(__dirname)],
    },
    watch: {
      ignored: ['**/backend/**', '**/node_modules/**'],
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
})
