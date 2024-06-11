<template>
  <VForm
    v-model="isValid"
    :disabled="isLoading"
    class="w-100"
  >
    <VContainer style="max-width: 1024px">
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="model.name"
            :rules="nameRules"
            name="name"
            label="name"
            required
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="model.description"
            label="description"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="model.address"
            label="address"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            v-model="model.phone"
            :rules="phoneRules"
            label="phone"
          />
        </VCol>

        <VCol>
          <VFileInput
            :accept="USER_AVATAR_FILE_TYPES"
            :rules="avatarRules"
            class="cursor-pointer"
            label="upload avatar"
            prepend-inner-icon="fas fa-file-upload"
            prepend-icon=""
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <span class="text-h6">Socials</span>
        </VCol>

        <VCol
          v-for="(social, idx) in MAX_USER_SOCIALS"
          :key="social"
          cols="12"
          sm="6"
        >
          <VTextField
            :model-value="model.socials[idx]"
            :rules="socialRules"
            :label="`social #${social}`"
            @update:model-value="changeSocial(idx, $event)"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol class="d-flex justify-end">
          <VBtn
            :disabled="isSaveChangesBtnDisabled"
            :loading="isLoading"
            @click="saveChanges"
          >
            Save changes
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VForm>
</template>

<script setup lang="ts">
import { cloneDeep, isEqual, isUndefined, omit } from 'lodash-es';
import {
  MIN_USER_NAME_LENGTH,
  MAX_USER_SOCIALS,
  USER_AVATAR_FILE_TYPES,
  MAX_USER_AVATAR_SIZE,
} from '~/configs/properties';
import type { Profile } from '~/types/user';
import { fileSizeValidator, fileTypeValidator, urlValidator, phoneValidator } from '~/utils/validators';

definePageMeta({
  layout: 'profile',
  middleware: 'auth',
});

useSeoMeta({ title: 'Profile' });

const USER_OMIT_PATHS = ['id', 'email'] as const;

const user = useUser();
const { openErrorSnackbar, openSuccessfulSnackbar } = useSnackbar();

const model = reactive<Omit<Profile, 'id' | 'email'>>(omit(cloneDeep(user.value), USER_OMIT_PATHS));

const isValid = ref<boolean>(true);
const isLoading = ref<boolean>(false);

const isSaveChangesBtnDisabled = computed<boolean>(
  () => !isValid.value || isEqual(model, omit(user.value, USER_OMIT_PATHS)),
);

const nameRules = [
  (value: string) => {
    if (value.length >= MIN_USER_NAME_LENGTH) {
      return true;
    }

    return `Name must be minimum ${MIN_USER_NAME_LENGTH} characters`;
  },
];

const phoneRules = [
  (value: string) => {
    if (!value) {
      return true;
    }

    const validation = phoneValidator.safeParse(value);
    return validation.success || validation.error.issues[0].message;
  },
];

const avatarRules = [
  (value: Array<File>) => {
    if (!value?.length) {
      return true;
    }

    const validation = fileSizeValidator(MAX_USER_AVATAR_SIZE).safeParse(value[0]);
    return validation.success || validation.error.issues[0].message;
  },
  (value: Array<File>) => {
    if (!value?.length) {
      return true;
    }

    const validation = fileTypeValidator(USER_AVATAR_FILE_TYPES).safeParse(value[0]);
    return validation.success || validation.error.issues[0].message;
  },
];

const socialRules = [
  (value: string) => {
    if (!value) {
      return true;
    }

    const validation = urlValidator.safeParse(value);
    return validation.success || validation.error.issues[0].message;
  },
];

const changeSocial = (idx: number, value: string) => {
  if (!isUndefined(model.socials[idx])) {
    model.socials[idx] = value;
  }
};

const saveChanges = async () => {
  try {
    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    openSuccessfulSnackbar('Changes have been successfully saved 👌');
  } catch (error) {
    openErrorSnackbar(error);
  } finally {
    isLoading.value = false;
  }
};
</script>
