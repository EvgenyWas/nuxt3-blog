import { request as octokitRequest } from '@octokit/request';

import { AUTH_PROVIDERS, COOKIE_NAMES, USER_IDENTITY_MAX_AGE } from '~/configs/properties';
import Profile from '~/server/models/user/profile.model';
import octokitOAuthApp from '~/server/services/octokitOAuthApp';
import { stringToBase64 } from '~/utils/converters';

const anotherAuthProviderMessage =
  // eslint-disable-next-line max-len
  'You tried signing in with a different authentication method than the one you used during signup. Please try again using your original authentication method.';

export default defineEventHandler(async (event) => {
  const queries = getQuery(event);
  try {
    const { authentication: auth } = await octokitOAuthApp.createToken({
      code: queries.code as string,
      state: queries.state as string | undefined,
    });
    const { data: user } = await octokitRequest('GET /user', {
      headers: { authorization: `${auth.type} ${auth.token}` },
    });
    const existedProfile = await Profile.findOne({ email: user.email });

    let profile = existedProfile;
    if (existedProfile) {
      if (existedProfile.auth_provider !== AUTH_PROVIDERS.Github) {
        return sendError(
          event,
          createError({ statusCode: 403, statusMessage: anotherAuthProviderMessage, fatal: true }),
        );
      }
    } else {
      profile = await Profile.create({
        name: user.name,
        email: user.email,
        avatar: user.avatar_url,
        auth_provider: AUTH_PROVIDERS.Github,
      });
    }

    const indentity = stringToBase64(JSON.stringify({ id: profile?._id.toString(), provider: AUTH_PROVIDERS.Github }));

    setCookie(event, COOKIE_NAMES.refreshToken, auth.refreshToken ?? '', {
      httpOnly: true,
      sameSite: true,
      expires: new Date(auth.refreshTokenExpiresAt ?? ''),
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
