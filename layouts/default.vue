<template>
  <VLayout class="flex-column rounded rounded-md">
    <VAppBar
      :height="headerHeight"
      class="d-flex justify-space-between px-5"
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
            @click="toggleDrawer"
          />
        </ClientOnly>
        <div
          v-if="!mobile"
          class="toolbar"
        >
          <VBtn
            variant="plain"
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
          <VMenu v-if="auth.authorized">
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                variant="plain"
                icon="fas fa-ellipsis-v"
              />
            </template>
            <VList>
              <VListItem
                :title="user.name"
                density="compact"
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
                :prepend-icon="link.icon"
                :to="link.to"
              >
                <VListItemTitle>{{ link.title }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
          <VBtn
            v-if="!auth.authorized"
            variant="plain"
            to="/login"
          >
            Log In
          </VBtn>
          <VBtn
            v-if="!auth.authorized"
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
    >
      <template v-if="auth.authorized">
        <VListItem
          :title="user.name"
          density="compact"
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
          :append-icon="link.icon"
          :to="link.to"
        >
          <VListItemTitle>{{ link.title }}</VListItemTitle>
        </VListItem>
      </template>
      <VListItem
        v-if="!auth.authorized"
        variant="tonal"
        title="Access Your Account"
        append-icon="fas fa-sign-in-alt"
        to="/login"
        slim
      />
      <VListItem
        v-if="!auth.authorized"
        variant="tonal"
        title="Get Started"
        append-icon="fas fa-user-plus"
        to="/signup"
        slim
      />
      <VDivider class="my-2" />
      <VListItem
        v-for="link in NAV_PUBLIC_LINKS"
        :key="link.to"
        :to="link.to"
      >
        <VListItemTitle>{{ link.title }}</VListItemTitle>
      </VListItem>
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

    <VContainer class="h-100">
      <VMain class="d-flex align-center justify-center h-100">
        <slot />
      </VMain>
    </VContainer>

    <VContainer class="pb-0">
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
import { FOOTER_LINKS, NAV_PUBLIC_LINKS, NAV_USER_LINKS } from '~/configs/properties';

const { isDark, toggleTheme } = useColorTheme();
const { mobile } = useDisplay();
const auth = useAuth();
const user = useUser();

const drawer = ref<boolean>(false);

const headerHeight = computed<number>(() => (mobile.value ? 48 : 64));

const footerColor = computed<string>(() => (isDark.value ? 'v-theme-surface' : 'black'));

const toggleDrawer = () => (drawer.value = !drawer.value);
</script>

<style scoped lang="scss">
$filter-black-to-white: invert(100%) sepia(33%) saturate(3149%) hue-rotate(185deg) brightness(107%) contrast(104%);

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
