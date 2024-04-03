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
        <h1 class="text-center mb-2">Sign Up</h1>
        <VDivider class="w-50 mb-2 mx-auto" />
        <VTextField
          v-model.trim.lazy="model.name"
          name="name"
          label="name"
          :rules="nameRules"
          required
        />
        <VTextField
          v-model.trim.lazy="model.email"
          type="email"
          name="email"
          label="email"
          :rules="emailRules"
          required
        />
        <VTextField
          v-model.trim.lazy="model.password"
          type="password"
          name="password"
          label="password"
          :rules="passwordRules"
          required
        />
        <VTextField
          v-model.trim.lazy="model.confirm"
          class="mb-4"
          type="password"
          name="confirm password"
          label="confirm your password"
          :rules="confirmRules"
          required
        />
        <VBtn
          class="w-50 mb-2 mx-auto"
          type="submit"
          :disabled="!isValid"
          :loading="isSubmitPending"
        >
          sign up
        </VBtn>
        <VFadeTransition>
          <p
            v-if="signupError"
            class="text-error text-caption text-center"
          >
            {{ signupError }}
          </p>
        </VFadeTransition>
        <div class="d-flex align-center w-50 mb-2 mx-auto">
          <VDivider />
          <span class="text-caption mx-2">or</span>
          <VDivider />
        </div>
        <AuthProviders />
        <p>
          Do you have an account?
          <NuxtLink
            class="font-weight-bold text-primary"
            to="/login"
          >
            Log In
          </NuxtLink>
        </p>
      </VForm>
    </VSheet>
  </VContainer>
</template>

<script setup lang="ts">
import AuthProviders from '~/components/AuthProviders.vue';
import { MIN_USER_NAME_LENGTH } from '~/configs/properties';
import type { SignupResponse } from '~/types/responses';

definePageMeta({
  layout: 'empty',
});

const model = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
});

const signupError = ref<string>('');
const isValid = ref<boolean>(true);
const isSubmitPending = ref<boolean>(false);

const nameRules = [
  (value: string) => {
    if (value.length >= MIN_USER_NAME_LENGTH) {
      return true;
    }

    return `Name must be minimum ${MIN_USER_NAME_LENGTH}`;
  },
];

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

const confirmRules = [
  (value: string) => {
    if (model.password === value) {
      return true;
    }

    return 'Your passwords must be the same.';
  },
];

const submit = async () => {
  signupError.value = '';
  isSubmitPending.value = true;
  try {
    const { token, profile } = await $fetch<SignupResponse>('/api/auth/signup', {
      method: 'POST',
      body: { email: model.email, name: model.name, password: stringToBase64(model.password) },
    });

    useAuth().value = { token, authorized: true };
    useUser().value = profile;
    await navigateTo('/');
  } catch (error: any) {
    signupError.value =
      isNuxtError(error) && error.statusMessage ? error.statusMessage : 'Signup failed, try please again';
  } finally {
    isSubmitPending.value = false;
  }
};
</script>
