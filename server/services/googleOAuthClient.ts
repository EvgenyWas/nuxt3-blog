import { OAuth2Client } from 'google-auth-library';

const googleOAuthClient = new OAuth2Client({
  clientId: process.env.NUXT_GOOGLE_CLIENT_ID,
  clientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.NUXT_PUBLIC_APP_URL}/google/oauth/callback`,
});

export default googleOAuthClient;
