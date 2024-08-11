<template>
  <VContainer class="h-100">
    <VRow>
      <VCol class="text-h4">Your favourite articles ❤️</VCol>
    </VRow>

    <VRow>
      <VCol>
        <VSkeletonLoader
          :loading="pending"
          type="list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line"
        >
          <VList
            v-if="filteredArticles.length"
            :disabled="!!deletingPath"
            class="w-100"
          >
            <VListItem
              v-for="article in filteredArticles"
              :key="article._path"
              :title="article.title"
              :subtitle="article.description"
              :prepend-avatar="article.image"
              lines="three"
              @click="$router.push({ path: article._path })"
            >
              <template #append>
                <div class="d-flex flex-column ga-2 ml-1">
                  <VChip
                    v-if="article._path"
                    :text="getTopic(article._path)"
                    density="compact"
                    rounded
                  />
                  <VBtn
                    :loading="deletingPath === article._path"
                    variant="text"
                    size="x-small"
                    @click.stop="removeFavourite(article)"
                  >
                    <VIcon icon="fas fa-trash" />
                    <VTooltip
                      activator="parent"
                      text="Delete from your favourites"
                    />
                  </VBtn>
                </div>
              </template>
            </VListItem>
          </VList>
          <VEmptyState
            v-else
            title="Your list is empty..."
            icon="far fa-folder-open"
            class="w-100"
          />
        </VSkeletonLoader>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { remove } from 'lodash-es';
import type { ArticleListItem } from '~/types/responses';

definePageMeta({
  layout: 'profile',
  middleware: 'auth',
});

const user = useUser();
const { fetchFavouritesArticlesList } = useContentAPI();
const { removeFavouriteArticle } = useUserAPI();
const { openSuccessfulSnackbar, openErrorSnackbar } = useSnackbar();

const deletingPath = ref<string>();

const favouritesPaths = computed<Array<string>>(() => user.value.favourites.map(({ path }) => path));

const { data: articles, pending } = useAsyncData('favourites', () =>
  fetchFavouritesArticlesList(favouritesPaths.value),
);

const filteredArticles = computed(
  () => articles.value?.filter(({ _path }) => favouritesPaths.value.includes(_path ?? '')) ?? [],
);

const getTopic = (path: string) => path.split('/')[2];

const removeFavourite = async (item: ArticleListItem) => {
  try {
    deletingPath.value = item._path;
    await removeFavouriteArticle(user.value.id ?? '', { body: { path: item._path ?? '' } });
    remove(user.value.favourites, ({ path }) => path === item._path);
    openSuccessfulSnackbar(`The article "${item.title}" has been removed from your favourites`);
  } catch (error) {
    openErrorSnackbar(error);
  } finally {
    deletingPath.value = '';
  }
};
</script>
