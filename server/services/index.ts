import googleOAuthClient from './googleOAuthClient';
import JWTGenerator from './jwtGenerator';
import octokitOAuthApp from './octokitOAuthApp';

const jwtGenerator = new JWTGenerator(process.env.NUXT_JWT_ACCESS_SECRET, process.env.NUXT_JWT_REFRESH_SECRET);

export { googleOAuthClient, jwtGenerator, octokitOAuthApp };
