// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  css: ["vuetify/styles", "@fortawesome/fontawesome-free/css/all.css"],
});
