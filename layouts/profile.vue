<template>
  <VLayout class="rounded rounded-md">
    <VNavigationDrawer>
      <VList>
        <VListItem title="Navigation drawer" />
      </VList>
    </VNavigationDrawer>

    <VAppBar title="Application bar"></VAppBar>

    <VMain
      class="d-flex align-center justify-center"
      style="min-height: 300px"
    >
      <slot />
    </VMain>
  </VLayout>
</template>

<script setup lang="ts"></script>
