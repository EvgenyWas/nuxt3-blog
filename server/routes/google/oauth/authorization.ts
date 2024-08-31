import { googleOAuthClient } from '~/server/services';

export default defineCachedEventHandler(
  (event) => {
    return sendRedirect(
      event,
      googleOAuthClient.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: true,
        redirect_uri: `${process.env.NUXT_PUBLIC_APP_URL}/google/oauth/callback`,
        scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
      }),
      301,
    );
  },
  {
    maxAge: 60 * 60 * 24, // 1 day
    swr: false,
  },
);
