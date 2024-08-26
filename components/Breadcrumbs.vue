<template>
  <VBreadcrumbs
    :items="items"
    class="flex-wrap"
    aria-label="breadcrumbs"
    divider=""
  >
    <template #prepend>
      <img
        src="/nuxt-icon.svg"
        alt="Nuxt icon"
        height="20"
        class="breadcrumbs-img"
      />
    </template>

    <template #title="{ item, index }">
      <span class="d-flex align-center text-subtitle-1">
        <span class="mr-2">
          <VIcon
            v-if="index"
            icon="fas fa-angle-right"
          />
        </span>
        {{ item.title }}
      </span>
    </template>
  </VBreadcrumbs>
</template>

<script setup lang="ts">
import type { Breadcrumb } from '~/types/components';

interface Props {
  items: Array<Breadcrumb>;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.v-application.v-theme--dark {
  .breadcrumbs {
    &-img {
      filter: $filter-black-to-white;
    }
  }
}
</style>
