import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon/icon-192x192.png', 'icon/icon-512x512.png', 'icon/IMG_SEGMENT_20251213_231003.png'],
      devOptions: {
        enabled: true, // Enable in development for testing
        type: 'module',
      },
      manifest: {
        name: 'Digi Play',
        short_name: 'Digi Play',
        description: 'با استفاده از این اپلیکیشن میتوانید به راحتی به تمام امکانات دسترسی داشته باشید',
        theme_color: '#FF6B35', // Orange color matching the app design
        background_color: '#FF6B35',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        categories: ['education', 'entertainment'],
        lang: 'fa',
        dir: 'rtl',
        shortcuts: [
          {
            name: 'خانه',
            short_name: 'خانه',
            description: 'بازگشت به صفحه اصلی',
            url: '/',
            icons: [{ src: '/icon/icon-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.(js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources-cache'
            }
          },
          {
            urlPattern: /^https:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutes
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      }
    })
  ],
})
