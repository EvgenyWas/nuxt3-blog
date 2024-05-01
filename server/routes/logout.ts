import { H3Event } from 'h3';

import { userIdentitySchema } from '../schemas';
import { AUTH_PROVIDERS, COOKIE_NAMES } from '~/configs/properties';
import octokitOAuthApp from '~/server/services/octokitOAuthApp';
import type { UserIdentity } from '~/server/types';
import { base64ToString } from '~/utils/converters';

const DEFAULT_LOCATION = '/';

const clean = (event: H3Event) => {
  setResponseHeader(event, 'Authorization', '');
  deleteCookie(event, COOKIE_NAMES.refreshToken);
  deleteCookie(event, COOKIE_NAMES.userIdentity);
};

export default defineEventHandler(async (event) => {
  const location = getRequestHeader(event, 'Location') ?? DEFAULT_LOCATION;
  const identityCookie = getCookie(event, COOKIE_NAMES.userIdentity) ?? '';

  let identity: UserIdentity;
  try {
    identity = userIdentitySchema.parse(JSON.parse(base64ToString(identityCookie)));
  } catch (error) {
    clean(event);

    return await sendRedirect(event, location, 302);
  }

  if (identity.provider === AUTH_PROVIDERS.Github) {
    console.log('ACCESS TOKEN:', getCookie(event, COOKIE_NAMES.refreshToken));
    try {
      await octokitOAuthApp.deleteToken({ token: getCookie(event, COOKIE_NAMES.refreshToken) ?? '' });
    } catch (error) {
      console.log('ERROR HELLO!', error);
    }
  }

  clean(event);

  return await sendRedirect(event, location, 302);
});
