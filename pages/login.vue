<template>
  <VContainer
    style="min-height: 100vh"
    fluid
  >
    <VSheet
      max-width="400"
      width="100%"
      class="pa-4 mx-auto mt-16"
      elevation="12"
      rounded="lg"
    >
      <VForm
        v-model="isValid"
        validate-on="input lazy"
        class="d-flex flex-column ga-2"
        @submit.prevent="submit"
      >
        <h1 class="text-center mb-2">Log In</h1>
        <VDivider class="w-50 mb-2 mx-auto" />
        <VTextField
          v-model.trim.lazy="model.email"
          :rules="emailRules"
          type="email"
          name="email"
          label="email"
          required
        />
        <VTextField
          v-model.trim.lazy="model.password"
          :rules="passwordRules"
          class="mb-2"
          type="password"
          name="password"
          label="password"
          required
        />
        <VBtn
          class="w-50 mb-2 mx-auto"
          type="submit"
          :disabled="!isValid"
          :loading="isSubmitPending"
        >
          log in
        </VBtn>
        <VFadeTransition>
          <p
            v-if="loginError"
            class="text-error text-caption text-center"
          >
            {{ loginError }}
          </p>
        </VFadeTransition>
        <div class="d-flex align-center w-50 mb-2 mx-auto">
          <VDivider />
          <span class="text-caption mx-2">or</span>
          <VDivider />
        </div>
        <AuthProviders />
        <p>
          Have not an account yet?
          <NuxtLink
            class="font-weight-bold text-primary"
            to="/signup"
          >
            Sign Up
          </NuxtLink>
        </p>
      </VForm>
    </VSheet>
  </VContainer>
</template>

<script setup lang="ts">
import AuthProviders from '~/components/AuthProviders.vue';
import type { LoginResponse } from '~/types/responses';

definePageMeta({
  layout: 'empty',
});

const router = useRouter();

const model = reactive({
  email: '',
  password: '',
});

const loginError = ref<string>('');
const isValid = ref<boolean>(true);
const isSubmitPending = ref<boolean>(false);

const emailRules = [
  (value: string) => {
    const validation = emailValidator.safeParse(value);
    return validation.success || validation.error.issues[0].message;
  },
];

const passwordRules = [
  (value: string) => {
    const validation = passwordValidator.safeParse(value);
    return validation.success || validation.error.issues[0].message;
  },
];

const submit = async () => {
  loginError.value = '';
  isSubmitPending.value = true;
  try {
    const { data, error } = await useAPIClient<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { email: model.email, password: stringToBase64(model.password) },
    });
    if (error.value) {
      throw error.value;
    }

    if (!data.value) {
      throw new Error('Login data is missed');
    }

    useAuth().value = { token: data.value.token, authorized: true };
    useUser().value = data.value.profile;
    if (router.options?.history?.state?.back) {
      router.back();
    } else {
      await router.replace('/');
    }
  } catch (error: any) {
    loginError.value =
      isNuxtError(error) && error.statusMessage ? error.statusMessage : 'Login failed, try please again';
  } finally {
    isSubmitPending.value = false;
  }
};
</script>
