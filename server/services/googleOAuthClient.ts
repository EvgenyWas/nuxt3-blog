import { google } from 'googleapis';

const googleOAuthClient = new google.auth.OAuth2({
  clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

google.options({ auth: googleOAuthClient });

export default googleOAuthClient;
