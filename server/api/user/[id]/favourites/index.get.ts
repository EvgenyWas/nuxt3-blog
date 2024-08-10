import { MongooseError } from 'mongoose';
import Profile from '~/server/models/user/profile.model';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'User ID is not provided' }));
  }

  try {
    const favourites = await Profile.findOne({ _id: id }).select('favourites -_id');
    if (!favourites) {
      throw new MongooseError('User with provided ID is not found');
    }

    return favourites;
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: isMongooseError(error) ? error.message : 'Bad Request' }),
    );
  }
});
