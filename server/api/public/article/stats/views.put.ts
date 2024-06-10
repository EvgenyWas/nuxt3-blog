import { ARTICLE_TOPICS } from '~/configs/properties';
import ArticleStats from '~/server/models/article/stats.model';

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
    await stats.updateOne({ views: stats.views + 1 });
  } else {
    await ArticleStats.create({ topic, title, views: 1 });
  }

  return true;
});
