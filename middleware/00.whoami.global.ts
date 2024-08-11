export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();
  const auth = useAuth();
  const { fetchWhoami } = useUserAPI();
  const headers = useRequestHeaders();

  if (headers['x-nuxt-error']) {
    return;
  }

  await callOnce(async () => {
    try {
      const data = await fetchWhoami();

      if (!data) {
        throw new Error('Profile data is missed in whoami request');
      }

      user.value = data;
    } catch (error) {
      auth.value = { token: '', authorized: false };
      console.log('Initial whoami request failed', error);
    }
  });
});
