<template>
  <VApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <VSnackbar
        v-bind="snackbar.current.value"
        v-model="snackbar.isActive.value"
        @after-leave="snackbar.onAfterLeave"
      >
        <template #text>
          <div class="d-flex align-center ga-2 pa-1">
            <VIcon
              v-if="snackbar.current.value?.icon"
              :icon="snackbar.current.value.icon"
              :color="snackbar.current.value.iconColor"
            />
            <span class="w-100 text-caption">{{ snackbarText }}</span>
          </div>
        </template>
      </VSnackbar>
    </ClientOnly>
  </VApp>
</template>

<script setup lang="ts">
import { truncate } from 'lodash-es';

const MAX_SNACKBAR_TEXT_LENGTH = 120;

const { initTheme } = useColorTheme();
const { snackbar } = useSnackbar();

const snackbarText = computed<string>(() =>
  truncate(snackbar.current.value?.text, { length: MAX_SNACKBAR_TEXT_LENGTH }),
);

onMounted(() => {
  initTheme();
});
</script>
