import { jwtGenerator } from '~/server/services';

const AUTHORIZED_PATHES = ['/api/user'];

export default defineEventHandler((event) => {
  if (AUTHORIZED_PATHES.some((path) => event.path.startsWith(path))) {
    const accessToken = getHeader(event, 'Authorization');
    try {
      if (accessToken) {
        jwtGenerator.verifyAccessToken(accessToken.replace('Bearer ', ''));
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
    }
  }
});
