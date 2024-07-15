<template>
  <div class="mb-8">
    <h1
      v-if="articles?.length"
      class="text-h3 text-md-h1 mb-6"
    >
      {{ topic.emoji }} {{ topic.title }}
    </h1>

    <VListItem
      v-for="article in articles"
      :key="article._path"
      :title="article.title"
      :subtitle="article.description"
      :prepend-avatar="article.image"
      :to="article._path"
      lines="three"
    />

    <VEmptyState
      v-if="!articles?.length"
      icon="fas fa-search"
      title="Oops! There are no articles for this topic..."
      text="Try to go to another topic or ask someone to add more articles to this one :)"
    />
  </div>
</template>

<script setup lang="ts">
import { ARTICLE_TOPICS } from '~/configs/properties';

const route = useRoute();
const { fetchArticlesListByTopic } = useContentAPI();

const topic = ARTICLE_TOPICS.find(({ name }) => name === route.params.topic);
if (!topic) {
  throw createError({ statusCode: 404, statusMessage: 'The requested articles topic does not exist', fatal: true });
}

const { data: articles, error } = await useAsyncData(`articles/${topic.name}`, () =>
  fetchArticlesListByTopic(topic.name),
);
if (error.value) {
  throw createError({ statusCode: 400, fatal: true });
}
</script>
