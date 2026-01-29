import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Service Worker and PWA disabled temporarily due to server MIME type issues
// import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    // Ensure proper chunking and module format
    rollupOptions: {
      output: {
        // Ensure proper module format
        format: 'es',
        // Preserve file extensions for proper MIME type detection
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  plugins: [
    react(),
    // PWA disabled temporarily (server MIME type issues). Re-enable: uncomment VitePWA import and add VitePWA({...}) here.
  ],
})
