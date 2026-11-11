import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // 相对路径：打包进 Capacitor 或部署到任意子路径都能用
  base: './',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      // 只在浏览器里注册 Service Worker，原生 App 里不需要（见 src/main.ts）
      injectRegister: null,
      manifest: {
        name: '我今天又难受了',
        short_name: '又难受了',
        description: '一本温柔的 CBT 认知重构记录本',
        lang: 'zh-CN',
        theme_color: '#F8EFE8',
        background_color: '#F8EFE8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 字体分片很多，不预缓存，用到哪个再缓存哪个
        globPatterns: ['**/*.{js,css,html,webp,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /\.woff2$/,
            handler: 'CacheFirst',
            options: { cacheName: 'wenkai-font', expiration: { maxEntries: 200 } },
          },
        ],
      },
    }),
  ],
})
