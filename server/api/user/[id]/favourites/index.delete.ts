import { MongooseError } from 'mongoose';
import { z } from 'zod';

import Profile from '~/server/models/user/profile.model';
import { userFavouriteSchema } from '~/server/schemas';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'User ID is not provided' }));
  }

  let payload: Pick<z.infer<typeof userFavouriteSchema>, 'path'>;
  try {
    payload = await readValidatedBody(event, (body) => userFavouriteSchema.pick({ path: true }).parse(body));
  } catch (error) {
    return sendError(event, createError({}));
  }

  try {
    const profile = await Profile.findOneAndUpdate({ _id: id }, { $pull: { favourites: payload } });
    if (!profile) {
      throw new MongooseError('User with provided ID is not found');
    }

    return true;
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: isMongooseError(error) ? error.message : 'Payload is invalid' }),
    );
  }
});
