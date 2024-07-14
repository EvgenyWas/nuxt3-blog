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

  const body = await readBody<{ rate: number | string }>(event);
  const bodyRate = Number(body?.rate);
  if (!bodyRate) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Body is not provided' }));
  }

  const stats = await ArticleStats.findOne({ topic, title });
  if (!stats) {
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: 'Article with provided topic and title does not exists' }),
    );
  }

  const ratings = stats.ratings + 1;
  const rate = ((stats.rate + bodyRate) / ratings).toFixed(1);

  await stats.updateOne({ ratings, rate });

  return true;
});
