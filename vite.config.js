import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    // force disable rolldown
    target: "esnext",
    rollupOptions: {}
  },
  optimizeDeps: {
    disabled: false
  }
})
