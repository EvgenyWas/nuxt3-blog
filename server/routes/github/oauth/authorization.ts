import { octokitOAuthApp } from '~/server/services';

export default defineCachedEventHandler(
  (event) => {
    return sendRedirect(
      event,
      octokitOAuthApp.getWebFlowAuthorizationUrl({
        allowSignup: true,
        redirectUrl: `${process.env.NUXT_PUBLIC_APP_URL}/github/oauth/callback`,
      }).url,
      301,
    );
  },
  {
    maxAge: 60 * 60 * 24, // 1 day
    swr: false,
  },
);
