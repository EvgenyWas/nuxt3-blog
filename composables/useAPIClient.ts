export default function useAPIClient<T>(
  ...[request, opts]: Parameters<typeof useFetch<T>>
): ReturnType<typeof useFetch<T>> {
  return useFetch<T>(request, {
    ...opts,
    retry: 2,
    retryStatusCodes: [401, 408, 409, 425, 429, 500, 502, 503, 504],
    ignoreResponseError: false,
    onRequest({ options }) {
      console.log('request', options);
      const token = useAuth().value.token;
      options.headers = new Headers(options.headers || {});
      if (token) {
        options.headers.append('Authorization', `Bearer ${token}`);
      } else {
        options.headers.delete('Authorization');
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        const auth = useAuth();
        const userAgent = process.server ? useRequestHeaders()['User-Agent'] ?? '' : navigator.userAgent;
        try {
          const { token } = await $fetch<{ token: string }>('/api/auth/token/refresh', {
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
