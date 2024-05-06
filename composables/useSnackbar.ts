import { isError, isString } from 'lodash-es';
import { nextTick, ref, shallowReactive, shallowRef } from 'vue';
import { VSnackbar } from 'vuetify/lib/components/index.mjs';

interface Snackbar
  extends Omit<
    VSnackbar['$props'],
    | '$children'
    | 'modelValue'
    | 'onUpdate:modelValue'
    | 'activator'
    | 'activatorProps'
    | 'closeDelay'
    | 'openDelay'
    | 'openOnClick'
    | 'openOnFocus'
    | 'openOnHover'
  > {
  icon?: string;
  iconColor?: string;
}

type SnackbarOptions = Omit<Snackbar, 'text'>;

const snackbars = shallowReactive<Array<Snackbar>>([]);
const current = shallowRef<Snackbar>();
const isActive = ref<boolean>(false);

const createSnackbar = (value: unknown, options = {} as SnackbarOptions): Snackbar => {
  switch (true) {
    case isString(value):
      return { text: value, ...options };
    // @ts-expect-error
    case isNuxtError(value):
      return { text: value.statusMessage || value.message };
    case isError(value):
      return { text: value.message, ...options };
    default:
      try {
        return { text: JSON.stringify(value), ...options };
      } catch (error) {
        return options;
      }
  }
};

export default function useSnackbar() {
  const showNext = () => {
    current.value = snackbars[0];
    snackbars.splice(0, 1);
    nextTick(() => (isActive.value = true));
  };

  const openSnackbar = (snackbar: Snackbar) => {
    snackbars.push(snackbar);
    if (!isActive.value) {
      showNext();
    }
  };

  const openSuccessfulSnackbar = (...[value, options = {}]: Parameters<typeof createSnackbar>) => {
    const snackbar = createSnackbar(value, { icon: 'fas fa-check-circle', iconColor: 'success', ...options });
    openSnackbar(snackbar);
  };

  const openWarningSnackbar = (...[value, options = {}]: Parameters<typeof createSnackbar>) => {
    const snackbar = createSnackbar(value, { icon: 'fas fa-exclamation-triangle', iconColor: 'warning', ...options });
    openSnackbar(snackbar);
  };

  const openErrorSnackbar = (...[value, options = {}]: Parameters<typeof createSnackbar>) => {
    const snackbar = createSnackbar(value, { icon: 'fas fa-exclamation-circle', iconColor: 'error', ...options });
    openSnackbar(snackbar);
  };

  const onAfterLeave = () => {
    if (snackbars.length) {
      showNext();
    } else {
      current.value = undefined;
    }
  };

  const onClose = () => {
    isActive.value = false;
  };

  return {
    snackbar: {
      current,
      isActive,
      onAfterLeave,
      onClose,
    },
    openSnackbar,
    openSuccessfulSnackbar,
    openWarningSnackbar,
    openErrorSnackbar,
  };
}
