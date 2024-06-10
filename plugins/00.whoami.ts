import type { WhoamiResponse } from '~/types/responses';

export default defineNuxtPlugin(async () => {
  const user = useUser();
  const auth = useAuth();

  try {
    const { data, error } = await useAPIClient<WhoamiResponse>('/api/user/whoami');
    if (error.value) {
      throw error.value;
    }

    if (!data.value) {
      throw new Error('Profile data is missed in whoami request');
    }

    user.value = data.value;
  } catch (error) {
    auth.value = { token: '', authorized: false };
    console.log('Initial whoami request failed', error);
  }
});
