import mongoose from 'mongoose';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: { name: 'fade', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  runtimeConfig: {
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    mongodbUrl: '',
    public: {
      appUrl: '',
    },
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
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/styles/variables.scss";',
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('Prose')) {
              return 'prose';
            }
          },
        },
      },
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Robots-Tag': 'noindex',
      },
    },
    '/signup': {
      ssr: false,
    },
    '/login': {
      ssr: false,
    },
    '/profile/**': {
      ssr: false,
    },
    '/articles/**': {
      swr: 60 * 15, // 10 minutes
    },
  },
  content: {
    highlight: {
      theme: {
        default: 'github-dark',
        sepia: 'monokai',
      },
    },
  },
  imports: {
    dirs: ['./composables', './composables/api', './utils'],
  },
  hooks: {
    'build:manifest': (manifest) => {
      // solve this issue with blocking stylesheets in rendered HTML with inline styles https://github.com/nuxt/nuxt/issues/21821
      for (const item of Object.values(manifest)) {
        // find the manifest item with css reference
        if (item.css) {
          // clear all references to exclude from the rendered HTML links
          item.css = [];
        }
      }
    },
    close: () => {
      mongoose.disconnect();
    },
  },
});
