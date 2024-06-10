import { pick } from 'lodash-es';
import { z } from 'zod';
import { AUTH_PROVIDERS, COOKIE_NAMES, USER_IDENTITY_MAX_AGE, USER_PROFILE_PICK_PATHS } from '~/configs/properties';
import Profile from '~/server/models/user/profile.model';
import { jwtGenerator } from '~/server/services';
import type { Profile as IProfile } from '~/types/user';
import { stringToBase64 } from '~/utils/converters';
import { emailValidator, passwordValidator } from '~/utils/validators';

const anotherAuthProviderMessage =
  // eslint-disable-next-line max-len
  'You tried signing in with a different authentication method than the one you used during signup. Please try again using your original authentication method.';

const loginPayloadSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
});

type Payload = z.infer<typeof loginPayloadSchema>;

export default defineEventHandler(async (event) => {
  let payload: Payload;
  try {
    payload = await readValidatedBody(event, (payload) => loginPayloadSchema.parse(payload));
  } catch (error) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Payload is incorrect' }));
  }

  const profile = {} as IProfile;
  try {
    const user = await Profile.findOne({ email: payload.email });
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User with the provided email does not exist' });
    }

    if (user.auth_provider !== AUTH_PROVIDERS.Email_And_Password) {
      throw createError({ statusCode: 404, statusMessage: anotherAuthProviderMessage });
    }

    if (user.password !== payload.password) {
      throw createError({ statusCode: 403, statusMessage: 'Password is incorrect' });
    }

    Object.assign(profile, { id: user._id.toString(), ...pick(profile, USER_PROFILE_PICK_PATHS) });
  } catch (error: any) {
    return sendError(event, error);
  }

  try {
    const { accessToken, refreshToken, refreshExpiresIn: maxAge } = jwtGenerator.sign({ id: profile.id });
    setCookie(event, COOKIE_NAMES.refreshToken, refreshToken, { httpOnly: true, sameSite: true, maxAge });

    const identity = stringToBase64(JSON.stringify({ id: profile.id, provider: AUTH_PROVIDERS.Email_And_Password }));
    setCookie(event, COOKIE_NAMES.userIdentity, identity, {
      httpOnly: true,
      sameSite: true,
      maxAge: USER_IDENTITY_MAX_AGE,
    });

    return { token: accessToken, profile };
  } catch (error) {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Internal server error' }));
  }
});
