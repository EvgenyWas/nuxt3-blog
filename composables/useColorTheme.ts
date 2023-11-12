import { useTheme } from 'vuetify';

const THEME_STORAGE_KEY = 'color-theme';

export default function useColorTheme() {
  const theme = useTheme();

  const isDark = computed<boolean>(() => theme.global.current.value.dark);

  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark';
    theme.global.name.value = newTheme;
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const initTheme = () => {
    try {
      const storagedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      theme.global.name.value = storagedTheme ?? 'light';
    } catch (error) {
      console.warn('Error in getting color theme from localStorage');
    }
  };

  return { isDark, toggleTheme, initTheme };
}
