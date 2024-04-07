import type { WhoamiResponse } from '~/types/responses';

export default defineNuxtPlugin(async () => {
  try {
    const { data, error } = await useAPIClient<WhoamiResponse>('/api/user/whoami');
    if (error.value) {
      throw error.value;
    }

    if (!data.value) {
      throw new Error('Profile data is missed in whoami request');
    }

    useUser().value = data.value;
  } catch (error) {
    console.log('Initial whoami request failed', error);
  }
});
