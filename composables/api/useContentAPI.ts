import { BEST_ARTICLES_LIMIT, MOST_VIEWED_ARTICLES_LIMIT } from '~/configs/properties';
import type { ArticleContent, ArticleListItem } from '~/types/responses';

const ARTICLE_LIST_ONLY: Array<keyof ArticleListItem> = ['_path', 'title', 'description', 'image', 'keywords'];
const ARTICLE_SIBLINGS_ONLY: Array<keyof ArticleListItem> = ['_path', 'title'];
const PAGINATION_LIMIT = 10;

interface PaginationOptions {
  skip?: number;
  limit?: number;
}

export default function useContentAPI() {
  const fetchArticle = (path: string) => queryContent<ArticleContent>(path).findOne();

  const fetchArticleSiblings = (path: string, topic?: string) =>
    queryContent<ArticleContent>()
      .only(ARTICLE_SIBLINGS_ONLY)
      .where({ _path: { $contains: `/articles/${topic}` } })
      .findSurround(path);

  const fetchArticlesListByTopic = (topic: string) =>
    queryContent<ArticleListItem>(`articles/${topic}`).only(ARTICLE_LIST_ONLY).find();

  const fetchMostViewedArticlesList = () =>
    queryContent<ArticleListItem>('articles').only(ARTICLE_LIST_ONLY).limit(MOST_VIEWED_ARTICLES_LIMIT).find(); // TODO: update

  const fetchBestArticlesList = () =>
    queryContent<ArticleListItem>('articles').only(ARTICLE_LIST_ONLY).limit(BEST_ARTICLES_LIMIT).find(); // TODO: update

  const fetchPaginalArticlesList = (options = {} as PaginationOptions) =>
    queryContent<ArticleListItem>('articles')
      .only(ARTICLE_LIST_ONLY)
      .skip(options.skip ?? 0)
      .limit(options.limit || PAGINATION_LIMIT)
      .find();

  const fetchFavouritesArticlesList = (paths: Array<string>) =>
    queryContent<ArticleListItem>('articles')
      .only(ARTICLE_LIST_ONLY)
      .where({ _path: { $in: paths } })
      .find();

  return {
    fetchArticle,
    fetchArticleSiblings,
    fetchArticlesListByTopic,
    fetchMostViewedArticlesList,
    fetchBestArticlesList,
    fetchPaginalArticlesList,
    fetchFavouritesArticlesList,
  };
}
