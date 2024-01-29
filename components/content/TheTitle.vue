<template>
  <section class="d-flex flex-column justify-center align-center mb-8 mb-md-12">
    <h1 class="mb-1 text-h5 text-md-h4 text-center">
      <ContentSlot
        :use="$slots.default"
        unwrap="p"
      />
    </h1>
    <p class="text-subtitle-1">
      <ContentSlot
        :use="$slots.author"
        unwrap="p"
      />
    </p>
    <NuxtLink
      v-if="href"
      :to="href"
      class="text-caption text-decoration-underline"
      target="_blank"
      external
    >
      Source Article
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
interface Props {
  href?: string;
}

defineProps<Props>();
</script>
