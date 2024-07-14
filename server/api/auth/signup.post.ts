import { z } from 'zod';

import { AUTH_PROVIDERS, COOKIE_NAMES, USER_IDENTITY_MAX_AGE } from '~/configs/properties';
import Profile from '~/server/models/user/profile.model';
import { jwtGenerator } from '~/server/services';
import type { Profile as IProfile } from '~/types/user';
import { stringToBase64 } from '~/utils/converters';

const signupPayloadSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })
  .required();

type Payload = z.infer<typeof signupPayloadSchema>;

export default defineEventHandler(async (event) => {
  let payload: Payload;
  try {
    payload = await readValidatedBody(event, (payload) => signupPayloadSchema.parse(payload));
  } catch (error) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Payload is incorrect' }));
  }

  const profile = {} as IProfile;
  try {
    const isUserExisted = await Profile.exists({ email: payload.email });
    if (isUserExisted) {
      throw createError({ statusCode: 404, statusMessage: 'User with the provided email already exists' });
    }

    const user = await Profile.create({ ...payload, provider: AUTH_PROVIDERS.Email_And_Password });
    Object.assign(profile, user.toObject());
  } catch (error) {
    return sendError(event, isError(error) ? error : createError({ statusCode: 404, statusMessage: error as string }));
  }

  const indentity = stringToBase64(JSON.stringify({ id: profile.id, provider: AUTH_PROVIDERS.Email_And_Password }));
  const { accessToken, refreshToken, refreshExpiresIn: maxAge } = jwtGenerator.sign({ id: profile.id });
  setCookie(event, COOKIE_NAMES.refreshToken, refreshToken, { httpOnly: true, sameSite: true, maxAge });
  setCookie(event, COOKIE_NAMES.userIdentity, indentity, {
    httpOnly: true,
    sameSite: true,
    maxAge: USER_IDENTITY_MAX_AGE,
  });

  return { token: accessToken, profile };
});
