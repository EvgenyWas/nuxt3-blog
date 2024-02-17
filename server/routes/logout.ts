import { COOKIE_NAMES } from '~/configs/properties';

const DEFAULT_LOCATION = '/';

export default defineEventHandler(async (event) => {
  const location = getRequestHeader(event, 'Location') ?? DEFAULT_LOCATION;

  setResponseHeader(event, 'Authorization', '');
  deleteCookie(event, COOKIE_NAMES.refreshToken);
  await sendRedirect(event, location, 302);
});
