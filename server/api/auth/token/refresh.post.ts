import { z } from 'zod';
import { AUTH_PROVIDERS, COOKIE_NAMES } from '~/configs/properties';
import { jwtGenerator } from '~/server/services';
import type { UserIdentity } from '~/server/types';
import { base64ToString } from '~/utils/converters';

const userIdentitySchema = z
  .object({
    id: z.string(),
    provider: z.nativeEnum(AUTH_PROVIDERS),
  })
  .required()
  .strict();

export default defineEventHandler((event) => {
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

  if (identity.provider === AUTH_PROVIDERS.Email_And_Password) {
    try {
      const { accessToken, refreshToken, refreshExpiresIn: maxAge } = jwtGenerator.refresh(token);
      setCookie(event, COOKIE_NAMES.refreshToken, refreshToken, { httpOnly: true, sameSite: true, maxAge });

      return { token: accessToken };
    } catch (error) {
      return sendError(event, createError({ statusCode: 401, data: error }));
    }
  }
});
