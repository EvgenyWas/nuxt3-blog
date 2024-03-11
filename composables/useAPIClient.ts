import type { TokenRefreshResponse } from '~/types/responses';

export default function useAPIClient<T>(
  ...[request, opts = {}]: Parameters<typeof useFetch<T>>
): ReturnType<typeof useFetch<T>> {
  const auth = useAuth();
  const refreshHeaders = process.server ? useRequestHeaders() : {};

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
          const { token } = await $fetch<TokenRefreshResponse>('/api/auth/token/refresh', {
            method: 'POST',
            headers: refreshHeaders,
          });
          auth.value = { token, authorized: true };
        } catch (error) {
          auth.value = { token: '', authorized: false };
        }
      }
    },
  });
}
