<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    loading="lazy"
  />
</template>

<script setup lang="ts">
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
});
</script>

<style scoped>
img {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 400px;
  margin: 16px auto;
  object-fit: contain;
}
</style>
