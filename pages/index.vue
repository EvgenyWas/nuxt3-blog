<template>
  <div class="d-flex flex-column w-100">
    <h1 class="d-none">Welcome to the Nuxt 3 blog!</h1>

    <section class="w-100 fill-height mb-4">
      <VParallax
        :src="'storage/app/home-parallax'"
        alt="two whales rushing into the water by Jeremy Ricketts"
        height="100vh"
      />
    </section>

    <section class="mb-4">
      <p class="text-body-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis nemo a autem quibusdam consequuntur error
        mollitia, at maiores omnis atque quidem aliquid libero. Facere explicabo doloremque laboriosam error ipsum
        expedita tempore magnam, pariatur impedit, dolorem qui animi blanditiis nihil repellat incidunt officia aliquid
        necessitatibus maxime. Et neque recusandae distinctio ad adipisci alias consequuntur laboriosam eos optio
        veniam, voluptas iste necessitatibus? Quae enim ut ipsum culpa perspiciatis nesciunt, architecto in maxime modi
        corrupti at numquam aut quo repellat deleniti! Accusamus dolores autem rerum voluptatibus, ipsam libero et,
        culpa facere maxime eum possimus natus optio debitis similique maiores distinctio, quos consequatur ullam!
      </p>
      <p class="text-body-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis nemo a autem quibusdam consequuntur error
        mollitia, at maiores omnis atque quidem aliquid libero. Facere explicabo doloremque laboriosam error ipsum
        expedita tempore magnam, pariatur impedit, dolorem qui animi blanditiis nihil repellat incidunt officia aliquid
        necessitatibus maxime. Et neque recusandae distinctio ad adipisci alias consequuntur laboriosam eos optio
        veniam, voluptas iste necessitatibus? Quae enim ut ipsum culpa perspiciatis nesciunt, architecto in maxime modi
        corrupti at numquam aut quo repellat deleniti! Accusamus dolores autem rerum voluptatibus, ipsam libero et,
        culpa facere maxime eum possimus natus optio debitis similique maiores distinctio, quos consequatur ullam!
      </p>
    </section>

    <VContainer tag="section">
      <VRow>
        <VCol
          cols="12"
          sm="6"
          md="4"
          xl="2"
        >
          <h2 class="text-h4 text-md-h3">
            Check out our <span class="text-decoration-underline">most viewed</span> articles 🤩
          </h2>
        </VCol>

        <VCol
          v-for="article in mostViewedArticles"
          :key="article._path"
          cols="12"
          sm="6"
          md="4"
          xl="2"
        >
          <VCard :to="article._path">
            <VImg
              v-if="article.image"
              :src="article.image"
              height="150"
              cover
            >
              <template #error>
                <VImg
                  :src="ARTICLE_IMAGE_FALLBACK"
                  alt="by Carrie Yang"
                  height="150"
                  cover
                />
              </template>
            </VImg>
            <VImg
              v-else
              :src="ARTICLE_IMAGE_FALLBACK"
              alt="by Carrie Yang"
              height="150"
              cover
            />

            <VCardItem
              :title="article.title"
              :subtitle="article.description"
            />
          </VCard>
        </VCol>

        <VCol v-if="bestArticlesError">
          <VEmptyState
            icon="fas fa-bug"
            title="Sorry, the most viewed articles have not been found"
          />
        </VCol>

        <template v-if="!mostViewedArticlesError && mostViewedArticlesPending">
          <VCol
            v-for="item in MOST_VIEWED_ARTICLES_LIMIT"
            :key="item"
            cols="12"
            sm="6"
            md="4"
            xl="2"
          >
            <VSkeletonLoader type="card" />
          </VCol>
        </template>
      </VRow>
    </VContainer>

    <VDivider class="w-50 my-8 mx-auto" />

    <VContainer tag="section">
      <VRow>
        <VCol
          cols="12"
          sm="6"
          md="4"
          xl="2"
          order-sm="1"
          order-md="2"
          :order-xl="MOST_VIEWED_ARTICLES_LIMIT"
        >
          <h2 class="text-h4 text-md-h3">
            ⭐ Check out our <span class="text-decoration-underline">best articles</span> by user rating
          </h2>
        </VCol>

        <VCol
          v-for="(article, idx) in bestArticles"
          :key="article._path"
          :order="idx"
          cols="12"
          sm="6"
          md="4"
          xl="2"
        >
          <VCard :to="article._path">
            <VImg
              v-if="article.image"
              :src="article.image"
              height="150"
              cover
            >
              <template #error>
                <VImg
                  :src="ARTICLE_IMAGE_FALLBACK"
                  alt="by Carrie Yang"
                  height="150"
                  cover
                />
              </template>
            </VImg>
            <VImg
              v-else
              :src="ARTICLE_IMAGE_FALLBACK"
              alt="by Carrie Yang"
              height="150"
              cover
            />

            <VCardItem
              :title="article.title"
              :subtitle="article.description"
            />
          </VCard>
        </VCol>

        <VCol v-if="bestArticlesError">
          <VEmptyState
            icon="fas fa-bug"
            title="Sorry, the best articles have not been found"
          />
        </VCol>

        <template v-if="!bestArticlesError && bestArticlesPending">
          <VCol
            v-for="item in BEST_ARTICLES_LIMIT"
            :key="item"
            cols="12"
            sm="6"
            md="4"
            xl="2"
          >
            <VSkeletonLoader type="card" />
          </VCol>
        </template>
      </VRow>
    </VContainer>

    <section class="mb-4">
      <p class="text-body-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis nemo a autem quibusdam consequuntur error
        mollitia, at maiores omnis atque quidem aliquid libero. Facere explicabo doloremque laboriosam error ipsum
        expedita tempore magnam, pariatur impedit, dolorem qui animi blanditiis nihil repellat incidunt officia aliquid
        necessitatibus maxime. Et neque recusandae distinctio ad adipisci alias consequuntur laboriosam eos optio
        veniam, voluptas iste necessitatibus? Quae enim ut ipsum culpa perspiciatis nesciunt, architecto in maxime modi
        corrupti at numquam aut quo repellat deleniti! Accusamus dolores autem rerum voluptatibus, ipsam libero et,
        culpa facere maxime eum possimus natus optio debitis similique maiores distinctio, quos consequatur ullam!
      </p>
      <p class="text-body-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis nemo a autem quibusdam consequuntur error
        mollitia, at maiores omnis atque quidem aliquid libero. Facere explicabo doloremque laboriosam error ipsum
        expedita tempore magnam, pariatur impedit, dolorem qui animi blanditiis nihil repellat incidunt officia aliquid
        necessitatibus maxime. Et neque recusandae distinctio ad adipisci alias consequuntur laboriosam eos optio
        veniam, voluptas iste necessitatibus? Quae enim ut ipsum culpa perspiciatis nesciunt, architecto in maxime modi
        corrupti at numquam aut quo repellat deleniti! Accusamus dolores autem rerum voluptatibus, ipsam libero et,
        culpa facere maxime eum possimus natus optio debitis similique maiores distinctio, quos consequatur ullam!
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { BEST_ARTICLES_LIMIT, MOST_VIEWED_ARTICLES_LIMIT } from '~/configs/properties';

const ARTICLE_IMAGE_FALLBACK = 'storage/app/article-fallback?height=450';

useHead({ link: [{ href: 'storage/app/home-parallax', as: 'image', type: 'image/webp', rel: 'preload' }] });
useSeoMeta({
  title: 'Nuxt 3 blog',
  description:
    'Nuxt 3 blog is a pet-project of Yauheni Vasiukevich. ' +
    'It consists of a wide collection of articles on various Web development topics.',
});

const { fetchMostViewedArticlesList, fetchBestArticlesList } = useContentAPI();

const {
  data: mostViewedArticles,
  pending: mostViewedArticlesPending,
  error: mostViewedArticlesError,
} = await useLazyAsyncData('most-viewed-articles', () => fetchMostViewedArticlesList(), { deep: false });

const {
  data: bestArticles,
  pending: bestArticlesPending,
  error: bestArticlesError,
} = await useLazyAsyncData('best-articles', () => fetchBestArticlesList(), { deep: false });
</script>
