<template>
  <div class="d-flex ga-3 justify-center">
    <NuxtLink
      :to="githubOAuthURL"
      aria-label="log in with GitHub"
      external
    >
      <VIcon
        icon="fab fa-github-square"
        size="50"
      />
    </NuxtLink>
    <NuxtLink
      :to="googleOAuthURL"
      aria-label="log in with Google"
      external
    >
      <VIcon
        icon="fab fa-google-plus-square"
        size="50"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const githubOAuthURL = `https://github.com/login/oauth/authorize?scope=read:user&client_id=${runtimeConfig.public.githubClientId}`;
const googleOAuthURL = '';
</script>

<style scoped></style>
