import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import { aliases, fa } from 'vuetify/iconsets/fa';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    blueprint: md3,
    icons: {
      defaultSet: 'fa',
      aliases,
      sets: {
        fa,
      },
    },
    display: {
      mobileBreakpoint: 'md',
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
