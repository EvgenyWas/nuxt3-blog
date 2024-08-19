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
          :rules="nameRules"
          name="name"
          label="name"
          required
        />
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
          type="password"
          name="password"
          label="password"
          required
        />
        <VTextField
          v-model.trim.lazy="model.confirm"
          :rules="confirmRules"
          class="mb-4"
          type="password"
          name="confirm password"
          label="confirm your password"
          required
        />
        <VBtn
          :disabled="!isValid"
          :loading="isSubmitPending"
          class="w-50 mb-2 mx-auto"
          type="submit"
        >
          sign up
        </VBtn>
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

definePageMeta({
  layout: 'empty',
  middleware: ['unauthorized'],
});

const { openErrorSnackbar } = useSnackbar();
const { signupWithEmailAndPassword } = useAuthAPI();

const model = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
});

const isValid = ref<boolean>(true);
const isSubmitPending = ref<boolean>(false);

const nameRules = [
  (value: string) => {
    if (value.length >= MIN_USER_NAME_LENGTH) {
      return true;
    }

    return `Name must be minimum ${MIN_USER_NAME_LENGTH} characters`;
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
  isSubmitPending.value = true;
  try {
    const { token, profile } = await signupWithEmailAndPassword({
      body: { email: model.email, name: model.name, password: stringToBase64(model.password) },
    });

    useAuth().value = { token, authorized: true };
    useUser().value = profile;
    await navigateTo('/');
  } catch (error) {
    openErrorSnackbar(error);
  } finally {
    isSubmitPending.value = false;
  }
};
</script>
