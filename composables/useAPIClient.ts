import { COOKIE_NAMES, USER_IDENTITY_MAX_AGE } from '~/configs/properties';
import type { TokenRefreshResponse } from '~/types/responses';

export default function useAPIClient<T>(
  ...[request, opts = {}]: Parameters<typeof useFetch<T>>
): ReturnType<typeof useFetch<T>> {
  const auth = useAuth();
  const headers = useRequestHeaders();
  const refreshTokenCookie = useCookie(COOKIE_NAMES.refreshToken, {
    sameSite: true,
    httpOnly: true,
    maxAge: USER_IDENTITY_MAX_AGE,
  });

  return useFetch<T>(request, {
    ...opts,
    retry: 2,
    retryStatusCodes: [401, 408, 409, 425, 429, 500, 502, 503, 504],
    onRequest({ options }) {
      const token = auth.value.token;
      options.headers = new Headers(options.headers || {});
      if (token) {
        options.headers.append('Authorization', `Bearer ${token}`);
      } else {
        options.headers.delete('Authorization');
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        try {
          const { accessToken, refreshToken } = await $fetch<TokenRefreshResponse>('/api/auth/token/refresh', {
            method: 'POST',
            headers,
          });

          refreshTokenCookie.value = refreshToken;
          auth.value = { token: accessToken, authorized: true };
        } catch (error) {
          auth.value = { token: '', authorized: false };
        }
      }
    },
  });
}
