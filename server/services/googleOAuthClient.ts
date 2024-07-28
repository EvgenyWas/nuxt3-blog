import { OAuth2Client } from 'google-auth-library';

const googleOAuthClient = new OAuth2Client({
  clientId: process.env.NUXT_GOOGLE_CLIENT_ID,
  clientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/google/oauth/callback',
});

export default googleOAuthClient;
