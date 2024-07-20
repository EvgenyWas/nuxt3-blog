import path from 'node:path';

// eslint-disable-next-line import/named
import { type UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import { fileToDataURI } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'User ID is not provided' }));
  }

  let dataURI;
  let fileName;
  try {
    const formData = await readFormData(event);
    const file = formData.get('avatar') as File;
    dataURI = await fileToDataURI(file);
    fileName = path.parse(file.name).name;
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: 'Attached file is missed or it is not valid.' }),
    );
  }

  try {
    const img = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      public_id: fileName,
      folder: `users/${id}`,
    });

    return `/storage/users/${id}/${img.public_id}`;
  } catch (error) {
    const cloudinaryError = error as UploadApiErrorResponse;
    return sendError(
      event,
      createError({ statusCode: cloudinaryError.http_code, statusMessage: cloudinaryError.message }),
    );
  }
});
