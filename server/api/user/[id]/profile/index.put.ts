import { MongooseError } from 'mongoose';

import Profile from '~/server/models/user/profile.model';
import { userUpdateProfileSchema } from '~/server/schemas';
import { isMongooseError } from '~/server/utils';
import type { Profile as ProfileType } from '~/types/user';
import { isZodError } from '~/utils/helpers';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'User ID is not provided' }));
  }

  let payload: Omit<ProfileType, 'email' | 'id'>;
  try {
    const body = await readBody(event);
    payload = userUpdateProfileSchema.parse(body);
  } catch (error) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: (isZodError(error) && error.errors[0]?.message) || 'Payload is invalid',
      }),
    );
  }

  try {
    const profile = await Profile.findOneAndUpdate({ _id: id }, payload, { new: true });
    if (!profile) {
      throw new MongooseError('User with provided ID is not found');
    }

    return profile.toObject();
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: isMongooseError(error) ? error.message : 'Payload is invalid' }),
    );
  }
});
