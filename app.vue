<template>
  <VApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </VApp>
</template>

<script setup lang="ts">
const { initTheme } = useColorTheme();

onMounted(() => {
  initTheme();
});
</script>
