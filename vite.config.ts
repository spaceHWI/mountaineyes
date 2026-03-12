import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 650,
  },
  plugins: [react(), cloudflare()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})