// eslint-disable-next-line import/named
import { v2 as cloudinary } from 'cloudinary';
import { SERVER_PATHES } from '~/configs/properties';

export default defineEventHandler((event) => {
  let assetUrl;
  try {
    const { req } = event.node;
    const { pathname, searchParams } = new URL(req.url ?? '', `http://${req.headers.host}`);
    const path = pathname.replace(SERVER_PATHES.routes.storage, '');
    assetUrl = cloudinary.url(path, {
      quality: 'auto',
      fetch_format: 'auto',
      width: searchParams.get('width'),
      height: searchParams.get('height'),
      gravity: searchParams.get('gravity'),
      crop: searchParams.get('crop'),
    });
  } catch (error) {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Internal Server Error', unhandled: false }));
  }

  return sendProxy(event, assetUrl);
});
