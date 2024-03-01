import { jwtGenerator } from '~/server/services';
import { stringToBase64 } from '~/utils/converters';

const AUTHORIZED_PATHES = ['/api/user'];

export default defineEventHandler((event) => {
  if (AUTHORIZED_PATHES.some((path) => event.path.startsWith(path))) {
    const accessToken = getHeader(event, 'Authorization');
    const audience = stringToBase64(getHeader(event, 'User-Agent') ?? '');
    try {
      if (accessToken) {
        jwtGenerator.verifyAccessToken(accessToken.replace('Bearer ', ''), audience);
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
    }
  }
});
