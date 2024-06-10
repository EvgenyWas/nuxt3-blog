import { userIdentitySchema } from '../schemas';
import { AUTH_PROVIDERS, COOKIE_NAMES } from '~/configs/properties';
import { googleOAuthClient, octokitOAuthApp } from '~/server/services';
import type { UserIdentity } from '~/server/types';
import { cleanAuth } from '~/server/utils';
import { base64ToString } from '~/utils/converters';

const DEFAULT_LOCATION = '/';

export default defineEventHandler(async (event) => {
  const location = getRequestHeader(event, 'Location') ?? DEFAULT_LOCATION;
  const identityCookie = getCookie(event, COOKIE_NAMES.userIdentity) ?? '';

  let identity: UserIdentity;
  try {
    identity = userIdentitySchema.parse(JSON.parse(base64ToString(identityCookie)));
  } catch (error) {
    cleanAuth(event);

    return await sendRedirect(event, location, 302);
  }

  const token = getCookie(event, COOKIE_NAMES.refreshToken) ?? '';
  if (identity.provider === AUTH_PROVIDERS.Github) {
    try {
      await octokitOAuthApp.deleteToken({ token });
    } catch (error) {
      console.log(error);
    }
  }

  if (identity.provider === AUTH_PROVIDERS.Google) {
    try {
      await googleOAuthClient.revokeToken(token);
    } catch (error) {
      console.log(error);
    }
  }

  cleanAuth(event);

  return await sendRedirect(event, location, 302);
});
