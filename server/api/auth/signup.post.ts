import { z } from 'zod';

import {
  AUTH_PROVIDERS,
  COOKIE_NAMES,
  MAX_USER_NAME_LENGTH,
  MIN_USER_NAME_LENGTH,
  USER_IDENTITY_MAX_AGE,
} from '~/configs/properties';
import Profile from '~/server/models/user/profile.model';
import { jwtGenerator } from '~/server/services';
import type { Profile as IProfile } from '~/types/user';
import { stringToBase64 } from '~/utils/converters';
import { isZodError } from '~/utils/helpers';
import { emailValidator, passwordValidator } from '~/utils/validators';

const signupPayloadSchema = z
  .object({
    name: z.string().min(MIN_USER_NAME_LENGTH).max(MAX_USER_NAME_LENGTH),
    email: emailValidator,
    password: passwordValidator,
  })
  .strict()
  .required();

type Payload = z.infer<typeof signupPayloadSchema>;

export default defineEventHandler(async (event) => {
  let payload: Payload;
  try {
    payload = await readValidatedBody(event, (body) => signupPayloadSchema.parse(body));
  } catch (error) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: (isZodError(error) && error.errors[0]?.message) || 'Sign up data is invalid',
      }),
    );
  }

  const profile = {} as IProfile;
  try {
    const isUserExisted = await Profile.exists({ email: payload.email });
    if (isUserExisted) {
      throw createError({ statusCode: 404, statusMessage: 'User with the provided email already exists' });
    }

    const user = await Profile.create({ ...payload, auth_provider: AUTH_PROVIDERS.Email_And_Password });
    Object.assign(profile, user.toObject());
  } catch (error) {
    return sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage: isMongooseError(error) ? error.message : 'Sign up data is invalid',
      }),
    );
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
