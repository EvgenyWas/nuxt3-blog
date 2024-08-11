import { createVuetify, type DefaultsInstance } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import { aliases, fa } from 'vuetify/iconsets/fa';

const defaults: DefaultsInstance = {
  VTextField: {
    density: 'comfortable',
    variant: 'solo-filled',
    clearable: true,
  },
  VFileInput: {
    density: 'comfortable',
    variant: 'solo-filled',
    clearable: true,
  },
  VSnackbar: {
    closeOnBack: false,
    closeOnContentClick: true,
    maxWidth: 350,
    elevation: 24,
    color: 'surface',
    location: 'right bottom',
  },
  VTooltip: {
    openDelay: 200,
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
