// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: { name: 'fade', mode: 'out-in' },
  },
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/eslint-module'],
  build: {
    transpile: ['vuetify'],
  },
  css: ['vuetify/styles', '@fortawesome/fontawesome-free/css/all.css', '@/assets/styles/index.scss'],
  typescript: {
    typeCheck: true,
  },
});
