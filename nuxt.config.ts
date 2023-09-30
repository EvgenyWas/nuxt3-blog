// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/eslint-module'],
  build: {
    transpile: ['vuetify'],
  },
  css: ['vuetify/styles', '@fortawesome/fontawesome-free/css/all.css'],
});
