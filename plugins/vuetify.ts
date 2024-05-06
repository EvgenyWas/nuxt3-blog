import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import { aliases, fa } from 'vuetify/iconsets/fa';

const defaults = {
  VTextField: {
    density: 'compact',
  },
  VSnackbar: {
    closeOnBack: false,
    closeOnContentClick: true,
    maxWidth: 350,
    elevation: 24,
    color: 'surface',
    location: 'right bottom',
  },
};

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
    defaults,
  });

  nuxtApp.vueApp.use(vuetify);
});
