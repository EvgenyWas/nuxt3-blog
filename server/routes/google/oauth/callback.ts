import { AUTH_PROVIDERS, COOKIE_NAMES, USER_IDENTITY_MAX_AGE } from '~/configs/properties';
import Profile from '~/server/models/user/profile.model';
import { googleOAuthClient } from '~/server/services';
import type { GoogleUserInfoResponse } from '~/server/types';
import { stringToBase64 } from '~/utils/converters';

const anotherAuthProviderMessage =
  // eslint-disable-next-line max-len
  'You tried signing in with a different authentication method than the one you used during signup. Please try again using your original authentication method.';

export default defineEventHandler(async (event) => {
  const queries = getQuery(event);
  try {
    if (queries.error) {
      return sendError(event, createError({ statusCode: 400, statusMessage: queries.error as string }));
    }

    const { tokens } = await googleOAuthClient.getToken(queries.code as string);
    const user = await $fetch<GoogleUserInfoResponse>('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const existedProfile = await Profile.findOne({ email: user.email });

    let profile = existedProfile;
    if (existedProfile) {
      if (existedProfile.auth_provider !== AUTH_PROVIDERS.Google) {
        return sendError(event, createError({ statusCode: 403, statusMessage: anotherAuthProviderMessage }));
      }
    } else {
      profile = await Profile.create({
        name: user.name,
        email: user.email,
        avatar: user.picture,
        auth_provider: AUTH_PROVIDERS.Google,
      });
    }

    googleOAuthClient.setCredentials(tokens);

    const indentity = stringToBase64(JSON.stringify({ id: profile?._id.toString(), provider: AUTH_PROVIDERS.Google }));

    setCookie(event, COOKIE_NAMES.refreshToken, tokens.refresh_token ?? '', {
      httpOnly: true,
      sameSite: true,
      maxAge: tokens.expiry_date as number,
    });
    setCookie(event, COOKIE_NAMES.userIdentity, indentity, {
      httpOnly: true,
      sameSite: true,
      maxAge: USER_IDENTITY_MAX_AGE,
    });

    return await sendRedirect(event, '/', 302);
  } catch (error) {
    return sendError(event, createError({ statusCode: 500, statusMessage: JSON.stringify(error) }));
  }
});
