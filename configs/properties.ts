export const NAV_PUBLIC_LINKS = [
  { to: '/about', title: 'About' },
  { to: '/articles', title: 'Articles' },
  { to: '/topics', title: 'Topics' },
];
export const NAV_USER_LINKS = [
  { to: '/profile', title: 'Profile', icon: 'fas fa-user' },
  { to: '/profile/favorites', title: 'Favorites', icon: 'fas fa-star' },
  { to: '/profile/comments', title: 'Comments', icon: 'fas fa-comments' },
  { to: '/profile/edit', title: 'Edit', icon: 'fas fa-pen' },
];
export const FOOTER_LINKS = [
  { to: 'https://linkedin.com/in/evgenywas/', icon: 'fab fa-linkedin' },
  { to: 'https://github.com/EvgenyWas/', icon: 'fab fa-github' },
];

export const MIN_USER_NAME_LENGTH = 3;

export const SERVER_PATHES = {
  routes: {
    storage: '/storage/',
  },
  api: {
    public: {},
    user: {},
  },
};

export const COOKIE_NAMES = {
  refreshToken: 'n3b-rt',
};

export enum AUTH_SCOPES {
  Email_And_Password = 'email&password',
  Google = 'google',
  Github = 'github',
}
