import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: { name: 'fade', mode: 'out-in' },
  },
  runtimeConfig: {
    cloudinaryCloudName: process.env.NUXT_CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.NUXT_CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET,
    mongodbUrl: process.env.NUXT_MONGODB_URL,
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify());
      });
    },
  ],
  build: {
    transpile: ['vuetify'],
  },
  css: ['vuetify/styles', '@fortawesome/fontawesome-free/css/all.css', '~/assets/styles/index.scss'],
  typescript: {
    typeCheck: true,
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  routeRules: {
    '/signup': { prerender: true, headers: { 'X-Robots-Tag': 'noindex' } },
    '/login': { prerender: true, headers: { 'X-Robots-Tag': 'noindex' } },
    '/profile/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex' } },
  },
  content: {
    highlight: {
      theme: {
        default: 'github-dark',
        sepia: 'monokai',
      },
    },
  },
});
