import { AUTH_PROVIDERS, COOKIE_NAMES } from '~/configs/properties';
import { userIdentitySchema } from '~/server/schemas';
import { googleOAuthClient, jwtGenerator, octokitOAuthApp } from '~/server/services';
import type { UserIdentity } from '~/server/types';
import { base64ToString } from '~/utils/converters';

const AUTHORIZED_PATHES = ['/api/user'];

export default defineEventHandler(async (event) => {
  if (AUTHORIZED_PATHES.some((path) => event.path.startsWith(path))) {
    let identity: UserIdentity;
    try {
      identity = userIdentitySchema.parse(
        JSON.parse(base64ToString(getCookie(event, COOKIE_NAMES.userIdentity) ?? '')),
      );
    } catch (error) {
      return sendError(
        event,
        createError({ statusCode: 403, statusMessage: 'User identity is not provided or incorrect' }),
      );
    }

    const accessToken = getHeader(event, 'Authorization');
    try {
      if (accessToken) {
        const token = accessToken.replace('Bearer ', '');
        if (identity.provider === AUTH_PROVIDERS.Github) {
          await octokitOAuthApp.checkToken({ token });
        } else if (identity.provider === AUTH_PROVIDERS.Google) {
          await googleOAuthClient.getTokenInfo(token);
        } else {
          jwtGenerator.verifyAccessToken(token);
        }
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
    }
  }
});
