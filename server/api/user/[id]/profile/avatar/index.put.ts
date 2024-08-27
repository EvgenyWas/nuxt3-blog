import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import { get, isEmpty } from 'lodash-es';
import { isCloudinarUploadApiError } from '~/server/utils';
import { MAX_USER_AVATAR_SIZE } from '~/configs/properties';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'User ID is not provided' }));
  }

  let filepath;
  let filename;
  try {
    const form = formidable({
      allowEmptyFiles: false,
      maxFiles: 1,
      maxFileSize: MAX_USER_AVATAR_SIZE,
    });
    const [, files] = await form.parse(event.node.req);
    if (isEmpty(files) || !files.avatar) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'File is required' }));
    }

    const file = files.avatar[0];
    if (!file.mimetype?.startsWith('image/')) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'File is not a valid image' }));
    }

    filepath = file.filepath;
    filename = path.parse(file.originalFilename ?? file.newFilename).name;
  } catch (error) {
    if (get(error, 'code') === formidable.errors.biggerThanMaxFileSize) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: `Attached file is bigger than ${MAX_USER_AVATAR_SIZE / 1024 / 1024} Mb`,
        }),
      );
    }

    if (get(error, 'code') === formidable.errors.missingContentType) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Attached file is missing type' }));
    }

    if (get(error, 'code') === formidable.errors.noEmptyFiles) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Attached file is empty' }));
    }

    return sendError(event, createError({ statusCode: 400, statusMessage: 'Attached file is invalid' }));
  }

  try {
    const img = await cloudinary.uploader.upload(filepath, {
      resource_type: 'image',
      public_id: filename,
      folder: `users/${id}`,
      transformation: { format: 'webp' },
    });

    return { path: `/storage/${img.public_id}` };
  } catch (error) {
    const errorInput = isCloudinarUploadApiError(error)
      ? { statusCode: error.http_code, statusMessage: error.message }
      : { statusCode: 500, statusMessage: 'Internal Server Error' };
    return sendError(event, createError(errorInput));
  }
});
