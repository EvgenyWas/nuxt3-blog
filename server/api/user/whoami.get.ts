import { COOKIE_NAMES } from '~/configs/properties';
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

    const { name, email, avatar } = profile;
    return { id: identity.id, name, email, avatar };
  } catch (error: any) {
    return sendError(event, error);
  }
});
