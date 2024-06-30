import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
     outDir: 'build',
     assetsInlineLimit: 10000,
  },
  server: {
     port: 5173,
     host: 'localhost',
  }

  // proxy: {
  //   '/api': {
  //     target: 'http://localhost:5000/api/v1',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api/v1': ''},
  //   },
  // },
})
