<template>
  <VLayout
    :class="{ 'default-layout-mobile': mobile }"
    class="flex-column rounded rounded-md"
  >
    <VAppBar
      :height="headerHeight"
      class="d-flex justify-space-between px-5"
      elevation="2"
      style="position: fixed"
    >
      <template #prepend>
        <NuxtLink
          :class="{ 'logo--dark': isDark }"
          class="logo"
          to="/"
        >
          <img
            class="w-sm-75"
            src="/nuxt-logo.svg"
            alt="Nuxt logo"
            width="128"
            height="32"
          />
        </NuxtLink>
      </template>

      <VAppBarTitle
        v-if="!mobile"
        tag="nav"
      >
        <VContainer>
          <VRow
            tag="ul"
            justify="center"
          >
            <VCol
              v-for="link in NAV_PUBLIC_LINKS"
              :key="link.to"
              tag="li"
              cols="2"
              class="d-flex justify-center text-capitalize"
            >
              <NuxtLink :to="link.to">{{ link.title }}</NuxtLink>
            </VCol>
          </VRow>
        </VContainer>
      </VAppBarTitle>

      <template #append>
        <ClientOnly>
          <VBtn
            v-if="mobile"
            :active="drawer"
            icon="fas fa-bars"
            variant="plain"
            aria-label="open site settings"
            @click="toggleDrawer"
          />
        </ClientOnly>

        <div
          v-if="!mobile"
          class="toolbar"
        >
          <VBtn
            variant="plain"
            aria-label="toggle website theme"
            icon
            @click="toggleTheme"
          >
            <VFabTransition>
              <VIcon
                v-if="isDark"
                icon="fas fa-moon"
              />
              <VIcon
                v-else
                icon="fas fa-sun"
              />
            </VFabTransition>
          </VBtn>

          <VMenu v-if="user.authorized">
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                variant="plain"
                icon="fas fa-ellipsis-v"
                aria-label="open menu with settings"
              />
            </template>

            <VList>
              <VListItem
                :title="user.profile.name"
                density="compact"
              >
                <template #prepend>
                  <UserAvatar
                    :src="user.profile.avatar"
                    :name="user.profile.name"
                  />
                </template>
              </VListItem>

              <VDivider class="my-2" />

              <VListItem
                v-for="link in NAV_USER_LINKS"
                :key="link.to"
                :title="link.title"
                :prepend-icon="link.icon"
                :to="link.to"
              />

              <VDivider
                v-if="user.authorized"
                class="my-2"
              />

              <VListItem
                v-if="user.authorized"
                title="Logout"
                prepend-icon="fas fa-sign-out-alt"
                href="/logout"
              />
            </VList>
          </VMenu>

          <VBtn
            v-if="!user.authorized"
            variant="plain"
            to="/login"
          >
            Log In
          </VBtn>

          <VBtn
            v-if="!user.authorized"
            variant="tonal"
            to="/signup"
          >
            Sign Up
          </VBtn>
        </div>
      </template>
    </VAppBar>

    <VNavigationDrawer
      v-if="mobile"
      v-model="drawer"
      location="right"
      temporary
      style="position: fixed"
    >
      <template v-if="user.authorized">
        <VListItem
          :title="user.profile.name"
          density="compact"
          class="mt-2"
        >
          <template #prepend>
            <UserAvatar
              :src="user.profile.avatar"
              :name="user.profile.name"
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
      </template>

      <VListItem
        v-if="!user.authorized"
        variant="tonal"
        title="Access Your Account"
        append-icon="fas fa-sign-in-alt"
        to="/login"
        slim
      />
      <VListItem
        v-if="!user.authorized"
        variant="tonal"
        title="Get Started"
        append-icon="fas fa-user-plus"
        to="/signup"
        slim
      />

      <VDivider class="my-2" />

      <VListItem
        title="Light / Dark"
        slim
      >
        <template #append>
          <VSwitch
            :model-value="isDark"
            false-icon="fas fa-sun"
            true-icon="fas fa-moon"
            density="compact"
            inset
            hide-details
            @update:model-value="toggleTheme"
          />
        </template>
      </VListItem>

      <VDivider class="my-2" />

      <VListItem
        v-for="link in NAV_PUBLIC_LINKS"
        :key="link.to"
        :title="link.title"
        :to="link.to"
      />

      <VDivider
        v-if="user.authorized"
        class="my-2"
      />

      <VListItem
        v-if="user.authorized"
        title="Logout"
        prepend-icon="fas fa-sign-out-alt"
        href="/logout"
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

    <VContainer
      class="h-100 pt-16"
      style="max-width: 1200px"
    >
      <Transition
        name="fade"
        mode="out-in"
      >
        <Breadcrumbs
          v-if="breadcrumbs.length"
          :items="breadcrumbs"
        />
      </Transition>

      <VMain class="d-flex flex-column align-center justify-center h-100 pt-0">
        <slot />
      </VMain>
    </VContainer>

    <VContainer
      class="pb-0"
      style="max-width: 1200px"
    >
      <VFooter
        :color="footerColor"
        style="height: 30vh"
      >
        <VContainer>
          <VRow
            tag="ul"
            justify="center"
            class="ga-4"
          >
            <VCol
              v-for="link in FOOTER_LINKS"
              :key="link.to"
              tag="li"
              cols="1"
              class="d-flex justify-center"
            >
              <NuxtLink
                :to="link.to"
                target="_blank"
                rel="noopener"
                aria-label="Yauheni Vasiukevich's social account"
                external
              >
                <VIcon
                  :icon="link.icon"
                  size="large"
                />
              </NuxtLink>
            </VCol>
          </VRow>

          <VRow
            tag="p"
            justify="center"
            class="text-subtitle-1 text-center"
          >
            © Yauheni Vasiukevich, Lisbon, Portugal
          </VRow>
        </VContainer>
      </VFooter>
    </VContainer>
  </VLayout>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import Breadcrumbs from '~/components/Breadcrumbs.vue';
import { FOOTER_LINKS, NAV_PUBLIC_LINKS, NAV_USER_LINKS } from '~/configs/properties';
import type { Breadcrumb } from '~/types/components';

const { isDark, toggleTheme } = useColorTheme();
const { mobile } = useDisplay();
const route = useRoute();
const user = useUser();

const drawer = ref<boolean>(false);

const headerHeight = computed<number>(() => (mobile.value ? 48 : 64));

const footerColor = computed<string>(() => (isDark.value ? 'v-theme-surface' : 'black'));

const breadcrumbs = computed<Array<Breadcrumb>>(() => {
  if (route.path === '/') {
    return [];
  }

  const items = route.path.split('/');
  return items.map((item, idx) => ({
    title: idx ? item : 'Home',
    to: idx ? `/${items.slice(1, idx + 1).join('/')}` : '/',
  }));
});

const toggleDrawer = () => (drawer.value = !drawer.value);
</script>

<style scoped lang="scss">
.logo {
  &--dark {
    filter: $filter-black-to-white;
  }
}

.icon {
  &--dark {
    filter: $filter-black-to-white;
  }
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  width: 128px;
}
</style>

<style lang="scss">
h1,
h2,
h3,
h4,
h5,
h6 {
  scroll-margin-top: 68px;
}

.default-layout-mobile {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    scroll-margin-top: 68px;
  }
}
</style>
