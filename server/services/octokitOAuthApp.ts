import { OAuthApp } from '@octokit/oauth-app';

const octokitOAuthApp = new OAuthApp({
  clientType: 'github-app',
  clientId: process.env.NUXT_PUBLIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
});

export default octokitOAuthApp;
