import type { FetchOptions } from 'ofetch';
import type { WhoamiResponse } from '~/types/responses';

interface WhoamiOptions extends FetchOptions {}

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

  const fetchWhoami = (options: WhoamiOptions = {}) =>
    fetchWithCookie<WhoamiResponse>(event, '/api/user/whoami', { ...defaultOptions, ...options, method: 'GET' });

  return { fetchWhoami };
}
