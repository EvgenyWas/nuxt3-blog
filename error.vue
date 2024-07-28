<template>
  <VEmptyState
    :headline="headline"
    :title="title"
    :action-text="actionText"
    :image="errorImage"
    bg-color="surface"
    height="100vh"
    @click:action="onActionClick"
  />
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import errorImage from '~/assets/icons/error.svg';

const props = defineProps<{ error: NuxtError & { data: { to?: string } } }>();

const route = useRoute();

const errorData = computed(() => {
  if (typeof props.error.data === 'string') {
    try {
      return JSON.parse(props.error.data);
    } catch (error) {
      return {};
    }
  } else {
    return props.error.data;
  }
});

const headline = computed<string>(() => String(route.query.code || props.error.statusCode || 404));

const title = computed<string>(
  () => route.query.message?.toString() || props.error.statusMessage || 'Oops! Something went wrong, try again',
);

const actionText = computed<string>(() => {
  switch (route.query.to?.toString() || errorData.value?.to) {
    case '/articles':
      return 'all articles';
    case '/signup':
      return 'go to sign up';
    case '/login':
      return 'go to log in';
    default:
      return 'go home';
  }
});

const onActionClick = () => navigateTo(route.query.to?.toString() || errorData.value?.to || '/');
</script>

<style>
.v-empty-state.v-theme--dark .v-img__img {
  filter: invert(99%) sepia(7%) saturate(24%) hue-rotate(282deg) brightness(108%) contrast(100%);
}
</style>
