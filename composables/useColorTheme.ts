import { useTheme } from 'vuetify';

enum THEMES {
  LIGHT = 'light',
  DARK = 'dark',
}

const THEME_COOKIE_NAME = 'color-theme';
const THEME_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

export default function useColorTheme() {
  const theme = useTheme();
  const themeCookie = useCookie(THEME_COOKIE_NAME, { maxAge: THEME_COOKIE_MAX_AGE });

  const isDark = computed<boolean>(() => theme.global.current.value.dark);

  const toggleTheme = () => {
    const newTheme = isDark.value ? THEMES.LIGHT : THEMES.DARK;
    theme.global.name.value = newTheme;
    themeCookie.value = newTheme;
  };

  const initTheme = () => {
    switch (themeCookie.value) {
      case THEMES.LIGHT:
        theme.global.name.value = THEMES.LIGHT;
        break;
      case THEMES.DARK:
        theme.global.name.value = THEMES.DARK;
        break;
      default:
        break;
    }
  };

  return { isDark, toggleTheme, initTheme };
}
