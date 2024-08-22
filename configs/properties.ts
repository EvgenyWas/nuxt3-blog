export const NAV_PUBLIC_LINKS = [
  { to: '/about', title: 'About' },
  { to: '/articles', title: 'Articles' },
];
export const NAV_USER_LINKS = [
  { to: '/profile', title: 'Profile', icon: 'fas fa-user' },
  { to: '/profile/favourites', title: 'Favourites', icon: 'fas fa-heart' },
];
export const FOOTER_LINKS = [
  { to: 'https://linkedin.com/in/evgenywas/', icon: 'fab fa-linkedin' },
  { to: 'https://github.com/EvgenyWas/', icon: 'fab fa-github' },
];

export const MIN_USER_NAME_LENGTH = 3;
export const MAX_USER_NAME_LENGTH = 100;
export const MAX_USER_DESCRIPTION_LENGTH = 500;
export const MAX_USER_ADDRESS_LENGTH = 100;
export const MAX_USER_SOCIALS = 4;
export const MAX_USER_SOCIAL_LENGTH = 100;
export const MAX_USER_AVATAR_SIZE = 3 * 1024 * 1024;
export const USER_AVATAR_FILE_TYPES = 'image/*' as const;

export const COOKIE_NAMES = {
  colorTheme: 'NUXT3_BLOG_CT',
  refreshToken: 'NUXT3_BLOG_RT',
  accessToken: 'NUXT3_BLOG_AT',
  userIdentity: 'NUXT3_BLOG_UI',
} as const;

export enum AUTH_PROVIDERS {
  Email_And_Password = 'email&password',
  Google = 'google',
  Github = 'github',
}
export const USER_IDENTITY_MAX_AGE = 0.5 * 365 * 24 * 60 * 60; // half a year

export const ARTICLE_TOPICS = [
  { name: 'css', title: 'CSS', emoji: '🧝‍♀️' },
  { name: 'html', title: 'HTML', emoji: '🤖' },
  { name: 'js', title: 'JavaScript', emoji: '😎' },
  { name: 'react', title: 'React.JS', emoji: '⚛️' },
  { name: 'vue', title: 'Vue.JS', emoji: '👽' },
  { name: 'web', title: 'WEB', emoji: '👾' },
];
export const ARTICLE_KEYWORDS = ['api', 'architecture', 'design', 'fundamentals', 'perfomance', 'refactoring'] as const;
export const MAX_ARTICLE_RATE = 5;
export const ARTICLE_RATE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
export const MOST_VIEWED_ARTICLES_LIMIT = 5;
export const BEST_ARTICLES_LIMIT = 5;

export const ACCESS_TOKEN_EXPIRES_IN = 60 * 5; // 5 minutes
export const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24; // 1 day
