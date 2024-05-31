<template>
  <div class="mb-8">
    <VContainer tag="section">
      <VRow>
        <VCol cols="7">
          <VChipGroup
            aria-label="topics"
            tag="nav"
            column
          >
            <VChip
              v-for="topic in ARTICLE_TOPICS"
              :key="topic.name"
              :text="`${topic.emoji} ${topic.title}`"
              :to="`/articles/${topic.name}`"
              :density="mobile ? 'compact' : 'default'"
            />
          </VChipGroup>
        </VCol>
      </VRow>
    </VContainer>

    <section>
      <VInfiniteScroll
        tag="ul"
        @load="onInfiniteScrollLoad"
      >
        <VListItem
          v-for="article in articles"
          :key="article._path"
          :title="article.title"
          :subtitle="article.description"
          :prepend-avatar="article.image"
          :to="article._path"
          lines="three"
        >
          <template #append>
            <VChip
              v-if="article._path"
              :text="getTopic(article._path)"
              density="compact"
              rounded
            />
          </template>
        </VListItem>

        <template #empty>
          <VAlert type="warning">No more articles.</VAlert>
        </template>

        <template #error="{ props }">
          <VAlert type="error">
            <div class="d-flex justify-space-between align-center">
              Something went wrong...
              <VBtn
                v-bind="props"
                size="small"
                variant="outlined"
              >
                Retry
              </VBtn>
            </div>
          </VAlert>
        </template>
      </VInfiniteScroll>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { VInfiniteScroll } from 'vuetify/components';
import { ARTICLE_TOPICS } from '~/configs/properties';
import type { ArticleListItem } from '~/types/responses';

const START_LIMIT = 10;
const EXTRA_LIMIT = 10;
const ARTICLE_ONLY: Array<keyof ArticleListItem> = ['_path', 'title', 'description', 'image'];

useSeoMeta({ title: 'Articles', description: 'All the blog articles' });

const { mobile } = useDisplay();
const { openErrorSnackbar } = useSnackbar();

const extraArticles = reactive<Array<ArticleListItem>>([]);

const { data, error } = await useAsyncData('articles', () =>
  queryContent<ArticleListItem>('articles').only(ARTICLE_ONLY).limit(START_LIMIT).find(),
);
if (!data.value || error.value) {
  throw createError({ statusCode: 404, fatal: true });
}

const articles = computed<Array<ArticleListItem>>(() => [...data.value!, ...extraArticles]);

const getTopic = (path: string) => path.split('/')[2];

const onInfiniteScrollLoad: VInfiniteScroll['$props']['onLoad'] = async ({ done }) => {
  try {
    const loadedArticles = await queryContent<ArticleListItem>('articles')
      .only(ARTICLE_ONLY)
      .skip(articles.value.length)
      .limit(EXTRA_LIMIT)
      .find();
    if (!loadedArticles.length) {
      return done('empty');
    }
    extraArticles.push(...loadedArticles);
    done('ok');
  } catch (error) {
    done('error');
    openErrorSnackbar(error);
  }
};
</script>
