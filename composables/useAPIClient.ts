import type { AuthState } from '~/types/states';

export default function useAPIClient<T>(
  ...[request, opts = {}]: Parameters<typeof useFetch<T>>
): ReturnType<typeof useFetch<T>> {
  const auth = useAuth();
  const userAgent = process.server ? useRequestHeaders()['user-agent'] : navigator.userAgent;

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
          const { token } = await $fetch<Pick<AuthState, 'token'>>('/api/auth/token/refresh', {
            method: 'POST',
            headers: { 'User-Agent': userAgent },
          });
          auth.value = { token, authorized: true };
        } catch (error) {
          auth.value = { token: '', authorized: false };
        }
      }
    },
  });
}
