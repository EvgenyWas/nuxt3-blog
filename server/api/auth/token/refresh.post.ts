import { AUTH_PROVIDERS, COOKIE_NAMES } from '~/configs/properties';
import { userIdentitySchema } from '~/server/schemas';
import { googleOAuthClient, jwtGenerator, octokitOAuthApp } from '~/server/services';
import type { UserIdentity } from '~/server/types';
import { base64ToString } from '~/utils/converters';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, COOKIE_NAMES.refreshToken);
  if (!token) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Token is not provided' }));
  }

  let identity: UserIdentity;
  try {
    identity = userIdentitySchema.parse(JSON.parse(base64ToString(getCookie(event, COOKIE_NAMES.userIdentity) ?? '')));
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'User identity is not provided or incorrect' }),
    );
  }

  if (identity.provider === AUTH_PROVIDERS.Github) {
    try {
      const { data } = await octokitOAuthApp.refreshToken({ refreshToken: token });
      setCookie(event, COOKIE_NAMES.refreshToken, data.refresh_token, {
        httpOnly: true,
        sameSite: true,
        maxAge: data.refresh_token_expires_in,
      });

      return { accessToken: data.access_token, type: data.token_type };
    } catch (error) {
      return sendError(
        event,
        createError({ statusCode: 500, statusMessage: 'Internal server error during refreshing token' }),
      );
    }
  }

  if (identity.provider === AUTH_PROVIDERS.Google) {
    try {
      googleOAuthClient.setCredentials({ refresh_token: token });
      const { credentials } = await googleOAuthClient.refreshAccessToken();
      setCookie(event, COOKIE_NAMES.refreshToken, credentials.refresh_token ?? '', {
        httpOnly: true,
        sameSite: true,
        maxAge: credentials.expiry_date as number,
      });

      return { accessToken: credentials.access_token, type: credentials.token_type };
    } catch (error) {
      return sendError(
        event,
        createError({ statusCode: 500, statusMessage: 'Internal server error during refreshing token' }),
      );
    }
  }

  try {
    const { accessToken, refreshToken, refreshExpiresIn: maxAge } = jwtGenerator.refresh(token);
    setCookie(event, COOKIE_NAMES.refreshToken, refreshToken, { httpOnly: true, sameSite: true, maxAge });

    return { accessToken, type: 'bearer' };
  } catch (error) {
    return sendError(event, createError({ statusCode: 401, data: error }));
  }
});
