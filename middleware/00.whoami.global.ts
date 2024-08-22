export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();
  const token = useToken();
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

      user.value.profile = data;
      user.value.authorized = true;
    } catch (error) {
      user.value.authorized = false;
      token.value = '';
      console.log('Initial whoami request failed', error);
    }
  });
});
