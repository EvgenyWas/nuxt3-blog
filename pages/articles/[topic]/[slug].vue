<template>
  <div class="container">
    <article class="article">
      <div class="d-flex flex-column justify-center align-center mb-8 mb-md-12">
        <h1 class="mb-2 text-h5 text-md-h4 text-center">{{ article?.title }}</h1>
        <p
          v-if="article?.author"
          class="text-subtitle-1 mb-2"
        >
          {{ article.author }}
        </p>
        <NuxtLink
          v-if="article?.src"
          :to="article.src"
          class="text-caption text-decoration-underline mb-2"
          target="_blank"
          external
        >
          Source article
        </NuxtLink>
        <img
          v-if="article?.image"
          :src="article.image"
          :alt="article?.title"
          class="article-image w-75"
        />
      </div>

      <ContentRenderer
        v-if="article"
        :value="article"
      />
    </article>

    <VContainer
      class="px-0"
      tag="section"
    >
      <VRow>
        <VCol cols="6">
          <VBtn
            v-if="prevSibling"
            variant="plain"
            prepend-icon="fas fa-chevron-left"
            rounded="md"
            @click="onPrevClick"
          >
            <VTooltip
              :text="prevSibling.title"
              location="top"
              activator="parent"
            />
            Previous
          </VBtn>
        </VCol>

        <VCol
          cols="6"
          class="d-flex justify-end"
        >
          <VBtn
            v-if="nextSibling"
            variant="plain"
            append-icon="fas fa-chevron-right"
            rounded="md"
            @click="onNextClick"
          >
            <VTooltip
              :text="nextSibling.title"
              location="top"
              activator="parent"
            />
            Next
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import type { ArticleContent } from '~/types/responses';

type ArticlePageTransition = 'slide-left' | 'slide-right' | 'fade';

definePageMeta({
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },
  middleware(to) {
    const pageTransition = useState<ArticlePageTransition>('article-page-transition');
    if (to.meta.pageTransition && typeof to.meta.pageTransition !== 'boolean' && pageTransition.value) {
      to.meta.pageTransition.name = pageTransition.value;
    }
  },
});

const pageTransition = useState<ArticlePageTransition>('article-page-transition');
const route = useRoute();

const { data: article, error } = await useAsyncData(route.path, () =>
  queryContent<ArticleContent>(route.path).sort({ id: 1, $numeric: true }).findOne(),
);
if (!article.value || error.value) {
  throw createError({ statusCode: 404, data: { to: '/articles' }, fatal: true });
}

useSeoMeta({ title: article.value?.title, description: article.value?.description });

const { data: siblings } = await useLazyAsyncData(
  () =>
    queryContent<ArticleContent>()
      .only(['_path', 'title'])
      .sort({ id: 1, $numeric: true })
      .where({ _path: { $contains: `/articles/${route.params.topic}` } })
      .findSurround(route.path),
  { deep: false },
);

const prevSibling = computed(() => siblings.value?.[0] as ArticleContent | undefined);

const nextSibling = computed(() => siblings.value?.[1] as ArticleContent | undefined);

const onPrevClick = () => {
  pageTransition.value = 'slide-right';
  navigateTo(prevSibling.value?._path);
};

const onNextClick = () => {
  pageTransition.value = 'slide-left';
  navigateTo(nextSibling.value?._path);
};

onBeforeRouteLeave((_, from) => {
  pageTransition.value = 'fade';
  if (from.meta.pageTransition && typeof from.meta.pageTransition !== 'boolean') {
    from.meta.pageTransition.name = 'fade';
  }
});
</script>

<style lang="scss">
.container {
  max-width: 100%;
}

.article {
  &-image {
    max-width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
  }

  ol {
    list-style-type: decimal;
  }

  ul {
    list-style-type: disc;
  }

  ol,
  ul {
    margin-bottom: 12px;
    padding-left: 30px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 12px;
  }
}
</style>
