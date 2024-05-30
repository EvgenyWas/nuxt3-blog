<template>
  <pre
    :class="$props.class"
    class="prose-pre"
  >
  <slot />
  </pre>
</template>

<script setup lang="ts">
defineProps({
  code: { type: String, default: '' },
  language: { type: String, default: null },
  filename: { type: String, default: null },
  highlights: { type: Array as () => number[], default: () => [] },
  meta: { type: String, default: null },
  class: { type: String, default: null },
});
</script>

<style>
.v-application.v-theme--light {
  .article {
    .prose-pre {
      background-color: rgb(var(--v-theme-on-surface));
    }
  }
}

.v-application.v-theme--dark {
  .article {
    .prose-pre {
      background-color: rgb(var(--v-theme-surface));
    }
  }
}

.prose-pre code .line {
  display: block;
}

.prose-pre {
  max-width: 100%;
  margin: 12px 0 20px;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}
</style>
