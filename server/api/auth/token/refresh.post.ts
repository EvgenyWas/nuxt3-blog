import { AUTH_PROVIDERS, COOKIE_NAMES } from '~/configs/properties';
import { userIdentitySchema } from '~/server/schemas';
import { jwtGenerator } from '~/server/services';
import octokitOAuthApp from '~/server/services/octokitOAuthApp';
import type { UserIdentity } from '~/server/types';
import { base64ToString } from '~/utils/converters';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, COOKIE_NAMES.refreshToken);
  if (!token) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Token is not provided' }));
  }

  const identityCookie = getCookie(event, COOKIE_NAMES.userIdentity) ?? '';
  let identity: UserIdentity;
  try {
    identity = userIdentitySchema.parse(JSON.parse(base64ToString(identityCookie)));
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'User identity is not provided or incorrect' }),
    );
  }

  if (identity.provider === AUTH_PROVIDERS.Github) {
    try {
      const { data } = await octokitOAuthApp.refreshToken({ refreshToken: token });

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        refreshTokenExpiresIn: data.refresh_token_expires_in,
      };
    } catch (error) {
      return sendError(
        event,
        createError({ statusCode: 500, statusMessage: 'Internal server error during refreshing token' }),
      );
    }
  } else {
    try {
      const { accessToken, refreshToken, refreshExpiresIn } = jwtGenerator.refresh(token);

      return { accessToken, refreshToken, refreshTokenExpiresIn: refreshExpiresIn };
    } catch (error) {
      return sendError(event, createError({ statusCode: 401, data: error }));
    }
  }
});
