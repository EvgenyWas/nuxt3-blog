import { isError, isString } from 'lodash-es';
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

interface SnackbarState {
  all: Array<Snackbar>;
  current: Snackbar | null;
  isActive: boolean;
}

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
  const state = useState<SnackbarState>('snackbar-state', () => ({ all: [], current: null, isActive: false }));

  const showNext = () => {
    state.value.current = state.value.all[0];
    state.value.all.splice(0, 1);
    nextTick(() => (state.value.isActive = true));
  };

  const openSnackbar = (snackbar: Snackbar) => {
    state.value.all.push(snackbar);
    if (!state.value.isActive) {
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
    if (state.value.all.length) {
      showNext();
    } else {
      state.value.current = null;
    }
  };

  const onClose = () => {
    state.value.isActive = false;
  };

  return {
    snackbar: {
      state,
      onAfterLeave,
      onClose,
    },
    openSnackbar,
    openSuccessfulSnackbar,
    openWarningSnackbar,
    openErrorSnackbar,
  };
}
