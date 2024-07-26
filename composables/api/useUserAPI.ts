import type { FetchOptions } from 'ofetch';
import type { WhoamiResponse } from '~/types/responses';
import type { Profile } from '~/types/user';

interface UpdateProfileOptions extends FetchOptions {
  body: Omit<Profile, 'id' | 'email'>;
}

interface UpdateProfileAvatarOptions extends FetchOptions {
  body: FormData;
}

const SOURCE_FETCH_OPTIONS: FetchOptions = {
  retry: 1,
  retryStatusCodes: [401, 408, 409, 425, 429, 500, 502, 503, 504],
};

export default function useUserAPI() {
  const auth = useAuth();
  const { refreshAccessToken } = useAuthAPI();
  const headers = useRequestHeaders();
  const event = useRequestEvent();

  const defaultOptions: FetchOptions = {
    ...SOURCE_FETCH_OPTIONS,
    headers,
    onRequest({ options }) {
      options.headers = new Headers(options.headers || {});
      if (auth.value.token) {
        options.headers.append('Authorization', `Bearer ${auth.value.token}`);
      } else {
        options.headers.delete('Authorization');
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        try {
          const { accessToken } = await refreshAccessToken();
          auth.value = { token: accessToken, authorized: true };
        } catch (error) {
          auth.value = { token: '', authorized: false };
        }
      }
    },
  };

  const fetchWhoami = (options: FetchOptions = {}) =>
    fetchWithCookie<WhoamiResponse>(event, '/api/user/whoami', { ...defaultOptions, ...options, method: 'GET' });

  const updateProfile = (id: string, options: UpdateProfileOptions) =>
    $fetch<Profile>(`/api/user/${id}/profile`, { ...defaultOptions, ...options, method: 'PUT' });

  const updateProfileAvatar = (id: string, options: UpdateProfileAvatarOptions) =>
    $fetch<string>(`/api/user/${id}/profile/avatar`, { ...defaultOptions, ...options, method: 'PUT' });

  return { fetchWhoami, updateProfile, updateProfileAvatar };
}
