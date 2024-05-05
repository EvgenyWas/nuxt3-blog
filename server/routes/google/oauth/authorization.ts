import { googleOAuthClient } from '~/server/services';

export default defineEventHandler((event) => {
  return sendRedirect(
    event,
    googleOAuthClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: true,
      redirect_uri: 'http://localhost:3000/google/oauth/callback',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    }),
    301,
  );
});
