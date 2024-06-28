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

definePageMeta({
  layout: 'empty',
});

const router = useRouter();

const { loginWithEmailAndPassword } = useAuthAPI();
const { openErrorSnackbar } = useSnackbar();

const model = reactive({
  email: '',
  password: '',
});

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
  isSubmitPending.value = true;
  try {
    const { token, profile } = await loginWithEmailAndPassword({
      body: { email: model.email, password: stringToBase64(model.password) },
    });

    useAuth().value = { token, authorized: true };
    useUser().value = profile;
    if (router.options?.history?.state?.back) {
      router.back();
    } else {
      await router.replace('/');
    }
  } catch (error) {
    openErrorSnackbar(error);
  } finally {
    isSubmitPending.value = false;
  }
};
</script>
