import { pick } from 'lodash-es';
import { ARTICLE_TOPICS } from '~/configs/properties';
import ArticleStats from '~/server/models/article/stats.model';
import type { ArticlesStats } from '~/types/responses';

export default defineEventHandler(async (event) => {
  const { topic, title } = getQuery<{ topic?: string; title?: string }>(event);
  if (!topic || !title) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Topic or title query are not provided' }));
  }

  if (!ARTICLE_TOPICS.find(({ name }) => name === topic)) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'The provided topic is not supported' }));
  }

  const stats = await ArticleStats.findOne({ topic, title });
  if (stats) {
    return pick(stats, ['views', 'rate', 'ratings']) as ArticlesStats;
  } else {
    return { views: 0, rate: 0, ratings: 0 } as ArticlesStats;
  }
});
