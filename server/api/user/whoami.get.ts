import { pick } from 'lodash-es';
import { COOKIE_NAMES, USER_PROFILE_PICK_PATHS } from '~/configs/properties';
import Profile from '~/server/models/user/profile.model';
import type { UserIdentity } from '~/server/types';
import { base64ToString } from '~/utils/converters';

export default defineEventHandler(async (event) => {
  let identity: UserIdentity;
  try {
    identity = JSON.parse(base64ToString(getCookie(event, COOKIE_NAMES.userIdentity) ?? ''));
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'User identity is not provided or incorrect' }),
    );
  }

  try {
    const profile = await Profile.findById(identity.id);
    if (!profile) {
      throw createError({ statusCode: 404, statusMessage: 'User profile is not found' });
    }

    return { ...pick(profile, USER_PROFILE_PICK_PATHS), id: identity.id };
  } catch (error: any) {
    return sendError(event, error);
  }
});
