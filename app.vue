<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
const { initTheme } = useColorTheme();

onMounted(() => {
  initTheme();
});
</script>
