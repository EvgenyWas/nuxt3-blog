import { z } from 'zod';
import { AUTH_SCOPES, COOKIE_NAMES } from '~/configs/properties';
import { jwtGenerator } from '~/server/services';
import { stringToBase64 } from '~/utils/converters';

const formDataPayloadSchema = z
  .object({
    scope: z.nativeEnum(AUTH_SCOPES),
  })
  .required()
  .strict();

export default defineEventHandler(async (event) => {
  const token = getCookie(event, COOKIE_NAMES.refreshToken);
  if (!token) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Token is not provided' }));
  }

  let payload: z.infer<typeof formDataPayloadSchema>;
  try {
    const formData = await readFormData(event);
    payload = formDataPayloadSchema.parse(Object.fromEntries(formData.entries()));
  } catch (error) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Payload is incorrect' }));
  }

  if (payload.scope === AUTH_SCOPES.Email_And_Password) {
    const audience = stringToBase64(getHeader(event, 'User-Agent') ?? '');
    try {
      const { accessToken, refreshToken } = jwtGenerator.refresh(token, audience);
      setCookie(event, COOKIE_NAMES.refreshToken, refreshToken, { httpOnly: true, sameSite: true });

      return { token: accessToken };
    } catch (error) {
      return sendError(event, createError({ statusCode: 401, data: error }));
    }
  }
});
