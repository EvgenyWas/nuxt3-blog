<template>
  <a
    :href="href"
    :target="target"
    class="text-decoration-underline"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
defineProps({
  href: { type: String, default: '' },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top'>,
    default: '_blank',
    required: false,
  },
});
</script>
