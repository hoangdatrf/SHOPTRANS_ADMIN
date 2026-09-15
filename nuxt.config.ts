export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,

  app: {
    head: {
      title: 'SHOPTRANS Admin',
      htmlAttrs: { lang: 'en-GB' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'theme-color', content: '#008f4c' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },

  devtools: { enabled: true },

  runtimeConfig: {
    backendBaseUrl: process.env.SHOPTRANS_BACKEND_URL
      || process.env.NUXT_PUBLIC_API_BASE_URL
      || 'http://127.0.0.1:5001',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '',
      apiPort: process.env.NUXT_PUBLIC_API_PORT || '5001',
    },
  },

  devServer: {
    port: 5002,
    host: '0.0.0.0',
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@ant-design-vue/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
  ],

  vite: {
    define: { global: 'globalThis' },
    build: { chunkSizeWarningLimit: 1000 },
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        assert: 'assert',
        http: 'stream-http',
        https: 'https-browserify',
        os: 'os-browserify',
        url: 'url',
      },
    },
  },

  primevue: {
    components: {
      exclude: ['Editor', 'Chart', 'Form', 'FormField'],
    },
  },

  build: {
    transpile: ['dayjs', 'lodash-es'],
  },

  nitro: {
    preset: 'node-server',
  },
})
