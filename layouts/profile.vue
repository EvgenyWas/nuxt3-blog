<template>
  <VLayout class="rounded rounded-md">
    <VNavigationDrawer v-model="drawer">
      <VListItem
        :title="user.name"
        density="compact"
        class="mt-2"
      >
        <template #prepend>
          <UserAvatar
            :src="user.avatar"
            :name="user.name"
          />
        </template>
      </VListItem>

      <VDivider class="my-2" />

      <VListItem
        v-for="link in NAV_USER_LINKS"
        :key="link.to"
        :title="link.title"
        :append-icon="link.icon"
        :to="link.to"
      />

      <VDivider class="my-6" />

      <VListItem
        title="Go back to the blog"
        prepend-icon="fas fa-chevron-left"
        to="/"
      />

      <template #append>
        <VImg
          :class="{ 'icon--dark': isDark }"
          class="mx-auto w-25"
          src="/nuxt-icon.svg"
          alt="Nuxt icon"
          aspect-ratio="1"
        />
      </template>
    </VNavigationDrawer>

    <VAppBar :title="appBarTitle">
      <template #prepend>
        <VBtn
          icon
          @click="toggleDrawer"
        >
          <VIcon :icon="toggleDrawerBtnIcon" />
        </VBtn>
      </template>
    </VAppBar>

    <VMain
      class="d-flex align-center justify-center"
      min-height="300"
    >
      <slot />
    </VMain>
  </VLayout>
</template>

<script setup lang="ts">
import { NAV_USER_LINKS } from '~/configs/properties';

useSeoMeta({ robots: 'noindex, nofollow' });

const { isDark } = useColorTheme();
const user = useUser();

const drawer = ref<boolean>(false);

const toggleDrawerBtnIcon = computed<string>(() =>
  drawer.value ? 'fas fa-caret-square-left' : 'fas fa-caret-square-right',
);

const appBarTitle = computed(() => `Welcome to your profile, ${user.value.name} :)`);

const toggleDrawer = () => (drawer.value = !drawer.value);
</script>
