import { COOKIE_NAMES } from '~/configs/properties';
import type { UserState } from '~/types/states';

export const useToken = () => useCookie<string>(COOKIE_NAMES.accessToken, { sameSite: true, secure: true });

export const useUser = () =>
  useState<UserState>('user', () => ({
    profile: {
      id: null,
      name: '',
      email: '',
      avatar: '',
      description: '',
      address: '',
      phone: '',
      socials: [],
      favourites: [],
    },
    authorized: false,
  }));
