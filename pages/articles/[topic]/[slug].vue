<template>
  <div class="container mb-8">
    <article class="article">
      <div class="article-header d-flex flex-column justify-center align-center mb-8 mb-md-12">
        <h1 class="mb-2 text-h5 text-md-h4 text-center">
          {{ article?.title }}
          <VTooltip text="Views of the article">
            <template #activator="{ props }">
              <span
                v-if="stats || !statsPending"
                v-bind="props"
                class="article-header-title-badge d-inline-flex align-center px-1 text-caption bg-grey rounded-xl"
              >
                {{ stats?.views }}&nbsp;
                <VIcon
                  icon="fas fa-eye"
                  size="12"
                />
              </span>
            </template>
          </VTooltip>
        </h1>

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
          class="article-header-image w-75"
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
      <VRow v-if="stats || !statsPending">
        <VCol class="d-flex flex-column align-center justify-center">
          <h4 class="text-h5 mb-2">⭐ Rating overview ⭐</h4>
          <p
            v-if="stats?.rate"
            class="text-h4"
          >
            {{ stats.rate }}
            <span class="text-h6 ml-n3">&nbsp;/ {{ MAX_ARTICLE_RATE }}</span>
          </p>
          <p v-else>Be the first to rate this article 😉</p>
          <VRating
            v-if="!rateCookie"
            v-model="rateModelValue"
            item-aria-label="rate {0} of {1}"
            color="yellow-darken-3"
            hover
            @update:model-value="rateArticle"
          />
          <p
            v-if="stats?.ratings"
            class="px-3"
          >
            {{ stats.ratings }} ratings ✨
          </p>
        </VCol>
      </VRow>

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

    <div id="views-observer" />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';
import { ARTICLE_RATE_MAX_AGE, MAX_ARTICLE_RATE } from '~/configs/properties';
import type { ArticleContent, ArticlesStats } from '~/types/responses';

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
const { openSuccessfulSnackbar, openErrorSnackbar } = useSnackbar();

const topic = route.params.topic;
const title = route.params.slug;

const rateCookie = useCookie(`article-rate-${topic}-${title}`, { maxAge: ARTICLE_RATE_MAX_AGE });

const rateModelValue = ref<number>(5);

const { data: article, error } = await useAsyncData(route.path, () =>
  queryContent<ArticleContent>(route.path).sort({ id: 1, $numeric: true }).findOne(),
);
if (!article.value || error.value) {
  throw createError({ statusCode: 404, data: { to: '/articles' }, fatal: true });
}

useSeoMeta({ title: article.value?.title, description: article.value?.description });

const { data: stats, pending: statsPending } = await useLazyAsyncData(
  () => $fetch<ArticlesStats>('/api/public/article/stats', { params: { topic, title } }),
  { deep: false },
);

const { data: siblings } = await useLazyAsyncData(
  () =>
    queryContent<ArticleContent>()
      .only(['_path', 'title'])
      .sort({ id: 1, $numeric: true })
      .where({ _path: { $contains: `/articles/${topic}` } })
      .findSurround(route.path),
  { deep: false },
);

const prevSibling = computed(() => siblings.value?.[0] as ArticleContent | undefined);

const nextSibling = computed(() => siblings.value?.[1] as ArticleContent | undefined);

const rateArticle = debounce(async (rate: number | string) => {
  try {
    await $fetch('/api/public/article/stats/rate', { method: 'PUT', params: { topic, title }, body: { rate } });
    rateCookie.value = 'true';
    openSuccessfulSnackbar('Thank you! Your rating has been recorded.');
  } catch (error) {
    openErrorSnackbar(error);
  }
}, 1000);

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

onMounted(() => {
  const viewsObserverTarget = document.querySelector('#views-observer');
  if (viewsObserverTarget) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(viewsObserverTarget);
            $fetch('/api/public/article/stats/views', { method: 'PUT', params: { topic, title } });
          }
        });
      },
      { root: null, threshold: 1 },
    );
    observer.observe(viewsObserverTarget);
  }
});
</script>

<style lang="scss">
.container {
  max-width: 100%;
}

.article {
  &-header {
    &-image {
      max-width: 100%;
      height: auto;
      max-height: 500px;
      object-fit: contain;
    }

    &-title {
      &-badge {
        transform: translateY(-5px);
      }
    }
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

#views-observer {
  position: absolute;
  top: 60%;
  left: 0;
  width: 100%;
  height: 1px;
}
</style>
