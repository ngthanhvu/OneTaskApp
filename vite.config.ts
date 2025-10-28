import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'app.png',
        'app.svg',
        'image.png'
      ],
      manifest: {
        name: 'TaskWan',
        short_name: 'TaskWan',
        description: 'Ứng dụng quản lý công việc với Vue + Supabase',
        theme_color: '#0ea5e9', // màu chủ đạo (ví dụ: sky-500)
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'app.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'app.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'app.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[a-zA-Z0-9.-]*supabase\.co\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 ngày
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    allowedHosts: ['proria.devgang.online'] 
  }
})
