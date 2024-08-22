<template>
  <div class="container position-relative mb-8">
    <article class="article">
      <div class="article-header d-flex flex-column justify-center align-center mb-8 mb-md-12">
        <h1 class="mb-2 text-h5 text-md-h4 text-center">
          <VTooltip
            :disabled="user.authorized"
            :text="favouriteBtnTooltip"
            location="top"
          >
            <template #activator="{ props }">
              <div
                v-bind="props"
                class="d-inline"
              >
                <VBtn
                  :disabled="!user.authorized"
                  :loading="isAddToFavouritesLoading"
                  :icon="favouriteBtnIcon"
                  aria-label="add the article to favourites"
                  variant="text"
                  size="small"
                  @click="onFavouriteBtnClick"
                />
              </div>
            </template>
          </VTooltip>

          {{ article?.title }}

          <VTooltip text="Views of the article">
            <template #activator="{ props }">
              <span
                v-if="stats || !statsPending"
                v-bind="props"
                class="article-header-title-badge d-inline-flex align-center px-2 text-caption bg-grey rounded-xl"
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
      <VExpandTransition>
        <VRow v-if="hasRatingOverview">
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
              v-if="ratings"
              class="px-3"
            >
              {{ ratings }}
            </p>
          </VCol>
        </VRow>
      </VExpandTransition>

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
import { remove } from 'lodash-es';
import { ARTICLE_RATE_MAX_AGE, MAX_ARTICLE_RATE } from '~/configs/properties';
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
const user = useUser();

const { openSuccessfulSnackbar, openErrorSnackbar } = useSnackbar();
const { fetchArticleStats, updateArticleRate, updateArticleViews } = usePublicAPI();
const { fetchArticle, fetchArticleSiblings } = useContentAPI();
const { addFavouriteArticle, removeFavouriteArticle } = useUserAPI();

const topic = route.params.topic as string;
const title = route.params.slug as string;

const rateCookie = useCookie(`article-rate-${topic}-${title}`, { maxAge: ARTICLE_RATE_MAX_AGE });

const rateModelValue = ref<number>(0);
const isAddToFavouritesLoading = ref<boolean>(false);

const { data: article, error } = await useAsyncData(route.path, () => fetchArticle(route.path), { deep: false });
if (!article.value || error.value) {
  throw createError({ statusCode: 404, data: { to: '/articles' }, fatal: true });
}

useSeoMeta({ title: article.value?.title, description: article.value?.description });

const { data: stats, pending: statsPending } = await useLazyAsyncData(
  () => fetchArticleStats({ params: { topic, title } }),
  { deep: false },
);

const { data: siblings } = await useLazyAsyncData(() => fetchArticleSiblings(route.path, topic), { deep: false });

const prevSibling = computed(() => siblings.value?.[0] as ArticleContent | undefined);

const nextSibling = computed(() => siblings.value?.[1] as ArticleContent | undefined);

const hasRatingOverview = computed<boolean>(() => !!stats.value || !statsPending.value);

const ratings = computed<string | null>(() => {
  if (stats.value?.ratings) {
    return `${stats.value.ratings} rating${stats.value.ratings > 1 ? 's' : ''} ✨`;
  } else {
    return null;
  }
});

const favouriteBtnTooltip = computed<string>(() => {
  if (user.value.authorized) {
    return 'Add the article to your favourites';
  } else {
    return 'Log in or sign up to save articles to your favourites';
  }
});

const isInFavourites = computed<boolean>(() =>
  Boolean(user.value.profile.favourites.find(({ path }) => path === route.path)),
);

const favouriteBtnIcon = computed<string>(() => (isInFavourites.value ? 'fas fa-heart' : 'far fa-heart'));

const rateArticle = async (rate: number | string) => {
  try {
    await updateArticleRate({ params: { topic, title }, body: { rate } });
    rateCookie.value = 'true';
    openSuccessfulSnackbar('Thank you! Your rating has been recorded.');
  } catch (error) {
    openErrorSnackbar(error);
  }
};

const onPrevClick = () => {
  pageTransition.value = 'slide-right';
  navigateTo(prevSibling.value?._path);
};

const onNextClick = () => {
  pageTransition.value = 'slide-left';
  navigateTo(nextSibling.value?._path);
};

const onFavouriteBtnClick = async () => {
  isAddToFavouritesLoading.value = true;
  try {
    if (isInFavourites.value) {
      await removeFavouriteArticle(user.value.profile.id ?? '', { body: { path: route.path } });
      remove(user.value.profile.favourites, ({ path }) => path === route.path);
      openSuccessfulSnackbar('The article has been removed from your favourites');
    } else {
      const favourite = await addFavouriteArticle(user.value.profile.id ?? '', {
        body: { path: route.path, title: article.value?.title ?? '', topic },
      });
      user.value.profile.favourites.push(favourite);
      openSuccessfulSnackbar('The article has been added to your favourites');
    }
  } catch (error) {
    openErrorSnackbar(error);
  } finally {
    isAddToFavouritesLoading.value = false;
  }
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
            updateArticleViews({ params: { topic, title } });
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
