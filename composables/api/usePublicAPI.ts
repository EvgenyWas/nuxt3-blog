import type { FetchOptions } from 'ofetch';
import type { ArticlesStats, UpdateArticleStatsResponse } from '~/types/responses';

interface FetchArticleStatsOptions extends FetchOptions {
  params: {
    topic: string;
    title: string;
  };
}

interface FetchArticleStatsRateOptions extends FetchArticleStatsOptions {
  body: {
    rate: string | number;
  };
}

export default function usePublicAPI() {
  const fetchArticleStats = (options: FetchArticleStatsOptions) =>
    $fetch<ArticlesStats>('/api/public/article/stats', { ...options, method: 'GET' });

  const updateArticleRate = (options: FetchArticleStatsRateOptions) =>
    $fetch<UpdateArticleStatsResponse>('/api/public/article/stats/rate', { ...options, method: 'PUT' });

  const updateArticleViews = (options: FetchArticleStatsOptions) =>
    $fetch<UpdateArticleStatsResponse>('/api/public/article/stats/views', { ...options, method: 'PUT' });

  return { fetchArticleStats, updateArticleRate, updateArticleViews };
}
