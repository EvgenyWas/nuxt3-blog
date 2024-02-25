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
          v-model="model.email"
          :rules="emailRules"
          type="email"
          name="email"
          label="email"
          required
        />
        <VTextField
          v-model="model.password"
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
    if (value) {
      return true;
    }

    return 'You must enter email.';
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) {
      return true;
    }

    return 'E-mail must be valid.';
  },
];

const passwordRules = [
  (value: string) => {
    if (value) {
      return true;
    }

    return 'You must enter password.';
  },
];

const submit = async () => {
  loginError.value = '';
  isSubmitPending.value = true;
  try {
    await useAPIClient('/api/auth/login', {
      method: 'POST',
      body: { email: stringToBase64(model.email), password: stringToBase64(model.password) },
    });
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
