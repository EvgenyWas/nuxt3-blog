import { MongooseError } from 'mongoose';
import { z } from 'zod';

import Profile from '~/server/models/user/profile.model';
import { userFavouriteSchema } from '~/server/schemas';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'User ID is not provided' }));
  }

  let payload: z.infer<typeof userFavouriteSchema>;
  try {
    payload = await readValidatedBody(event, (body) => userFavouriteSchema.parse(body));
  } catch (error) {
    return sendError(event, createError({}));
  }

  try {
    const profile = await Profile.findOne({ _id: id });
    if (!profile) {
      throw new MongooseError('User with provided ID is not found');
    }

    if (profile.favourites.find(({ path }) => path === payload.path)) {
      throw new MongooseError('Article with provided path is already in favourites list');
    }

    profile.favourites.push(payload);
    await profile.save();

    return payload;
  } catch (error) {
    console.log(error);
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: isMongooseError(error) ? error.message : 'Payload is invalid' }),
    );
  }
});
