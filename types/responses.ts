import type { MarkdownParsedContent } from '@nuxt/content/types';
import type { AuthState } from './states';
import type { Profile } from './user';
import type { ARTICLE_KEYWORDS } from '~/configs/properties';

export interface SignupResponse {
  token: AuthState['token'];
  profile: Profile;
}

export type LoginResponse = SignupResponse;

export interface TokenRefreshResponse {
  accessToken: string;
  type: string;
}

export type WhoamiResponse = Profile;

export interface ArticleContent extends MarkdownParsedContent {
  title: string;
  description: string;
  image?: string;
  src?: string;
  author?: string;
  keywords: Array<(typeof ARTICLE_KEYWORDS)[number]>;
}
