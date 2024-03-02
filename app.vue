<template>
  <VApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </VApp>
</template>

<script setup lang="ts">
import type { UserState } from '~/types/states';

const { initTheme } = useColorTheme();

try {
  await callOnce(async () => {
    const { data, error } = await useAPIClient<UserState>('/api/user/whoami');
    if (error.value) {
      throw error.value;
    }

    if (!data.value) {
      throw new Error('Profile data is missed');
    }

    useUser().value = data.value;
  });
} catch (error) {
  console.log('Initial whomain request failed', error);
}

onMounted(() => {
  initTheme();
});
</script>
