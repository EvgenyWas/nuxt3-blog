<template>
  <VAvatar>
    <VImg
      :src="src"
      :alt="name"
    >
      <template #error>
        <VSheet
          v-if="fallbackTitle"
          class="d-flex justify-center align-center w-100 h-100 bg-grey"
        >
          {{ fallbackTitle }}
        </VSheet>
        <VIcon
          v-else
          icon="fas fa-user-circle"
          class="w-100 h-100"
          size="x-large"
          color="grey"
        />
      </template>
    </VImg>
  </VAvatar>
</template>

<script setup lang="ts">
interface Props {
  src?: string;
  name?: string;
}

const props = defineProps<Props>();

const fallbackTitle = computed<string>(() => {
  if (!props.name) {
    return '';
  }

  const nameParts = props.name?.split(' ');
  const firstLetterFirstName = nameParts?.[0]?.[0]?.toUpperCase() ?? '';
  const firstLetterSecondName = nameParts?.[1]?.[0]?.toUpperCase() ?? '';

  return firstLetterFirstName + firstLetterSecondName;
});
</script>
