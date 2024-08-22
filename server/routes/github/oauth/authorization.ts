import { octokitOAuthApp } from '~/server/services';

export default defineEventHandler((event) => {
  return sendRedirect(
    event,
    octokitOAuthApp.getWebFlowAuthorizationUrl({
      allowSignup: true,
      redirectUrl: `${process.env.NUXT_PUBLIC_APP_URL}/github/oauth/callback`,
    }).url,
    301,
  );
});
