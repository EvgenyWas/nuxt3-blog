import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler((event) => {
  const filePath = event.path.replace('/storage', '');
  const assetUrl = cloudinary.url(filePath);

  return sendProxy(event, assetUrl);
});
