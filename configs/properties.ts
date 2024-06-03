export const NAV_PUBLIC_LINKS = [
  { to: '/about', title: 'About' },
  { to: '/articles', title: 'Articles' },
];
export const NAV_USER_LINKS = [
  { to: '/profile', title: 'Profile', icon: 'fas fa-user' },
  { to: '/profile/favorites', title: 'Favorites', icon: 'fas fa-heart' },
  { to: '/profile/comments', title: 'Comments', icon: 'fas fa-comments' },
];
export const FOOTER_LINKS = [
  { to: 'https://linkedin.com/in/evgenywas/', icon: 'fab fa-linkedin' },
  { to: 'https://github.com/EvgenyWas/', icon: 'fab fa-github' },
];

export const MIN_USER_NAME_LENGTH = 3;

export const COOKIE_NAMES = {
  refreshToken: 'NUXT3_BLOG_RT',
  userIdentity: 'NUXT3_BLOG_UI',
} as const;

export enum AUTH_PROVIDERS {
  Email_And_Password = 'email&password',
  Google = 'google',
  Github = 'github',
}
export const USER_IDENTITY_MAX_AGE = 0.5 * 365 * 24 * 60 * 60;

export const ARTICLE_TOPICS = [
  { name: 'css', title: 'CSS', emoji: '🧝‍♀️' },
  { name: 'html', title: 'HTML', emoji: '🤖' },
  { name: 'js', title: 'JavaScript', emoji: '😎' },
  { name: 'react', title: 'React.JS', emoji: '⚛️' },
  { name: 'vue', title: 'Vue.JS', emoji: '👽' },
  { name: 'web', title: 'WEB', emoji: '👾' },
];

export const ARTICLE_KEYWORDS = ['api', 'architecture', 'design', 'fundamentals', 'perfomance', 'refactoring'] as const;
