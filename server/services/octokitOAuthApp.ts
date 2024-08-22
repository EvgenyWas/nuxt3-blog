import { OAuthApp } from '@octokit/oauth-app';

const octokitOAuthApp = new OAuthApp({
  clientType: 'github-app',
  clientId: process.env.NUXT_GITHUB_CLIENT_ID,
  clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
  redirectUrl: `${process.env.NUXT_PUBLIC_APP_URL}/github/oauth/callback`,
});

export default octokitOAuthApp;
