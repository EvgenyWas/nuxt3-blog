import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler((event) => {
  let assetUrl;
  try {
    const { req } = event.node;
    const { pathname, searchParams } = new URL(req.url ?? '', `http://${req.headers.host}`);
    const path = pathname.replace('/storage/', '');
    assetUrl = cloudinary.url(path, {
      quality: 'auto',
      fetch_format: 'webp',
      width: searchParams.get('width'),
      height: searchParams.get('height'),
      gravity: searchParams.get('gravity'),
      crop: searchParams.get('crop'),
      aspect_ratio: searchParams.get('aspect_ratio'),
    });
  } catch (error) {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Internal Server Error', unhandled: false }));
  }

  return sendProxy(event, assetUrl);
});
