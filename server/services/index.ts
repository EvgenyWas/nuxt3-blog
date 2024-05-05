import googleOAuthClient from './googleOAuthClient';
import JWTGenerator from './jwtGenerator';
import octokitOAuthApp from './octokitOAuthApp';

const jwtGenerator = new JWTGenerator(process.env.JWT_ACCESS_SECRET, process.env.JWT_REFRESH_SECRET);

export { googleOAuthClient, jwtGenerator, octokitOAuthApp };
