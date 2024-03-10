<template>
  <VAvatar>
    <VImg
      v-if="src && !isError"
      :src="src"
      :alt="name"
      @error="fireError"
    />
    <template v-else>
      <VSheet
        v-if="fallbackTitle"
        class="d-flex justify-center align-center w-100 h-100 bg-grey text-uppercase"
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
  </VAvatar>
</template>

<script setup lang="ts">
interface Props {
  src?: string;
  name?: string;
}

const props = defineProps<Props>();

const isError = ref<boolean>(false);

const fallbackTitle = computed<string>(() => {
  if (!props.name) {
    return '';
  }

  const [firstName, secondName] = props.name?.split(' ');

  return (firstName?.[0] ?? '') + (secondName?.[0] ?? '');
});

const fireError = () => (isError.value = true);
</script>
